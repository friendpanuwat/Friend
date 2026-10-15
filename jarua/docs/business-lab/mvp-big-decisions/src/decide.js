/* ============================================================
   DECIDE — เทียบ "ไม่ทำ" กับ "ทำ" ของเรื่องใหญ่แต่ละเรื่อง
   ทุกตัวเลขต่อเดือนคำนวณด้วย JaruaCalc.calculateV4 (ตัวคำนวณของ PL2) ไม่มีสูตรกำไรของตัวเอง
   ส่วนที่คิดเพิ่มใน Lab: แปลงการตัดสินใจเป็นตัวเลขร้านชุดใหม่ · เงินก้อนที่จ่ายครั้งเดียว · ยอดที่ค่อย ๆ ขึ้น
   · เงินที่จมเพิ่มในลูกหนี้และสต็อกช่วงเริ่ม · คืนทุน · จุดคุ้ม · ถ้าไม่เป็นอย่างที่คาด
   ============================================================ */

var DMEMO = new Map();
function runCalc(v4) {
  var key = JSON.stringify(v4);
  var r = DMEMO.get(key);
  if (r) return r;
  r = JaruaCalc.calculateV4(v4);
  if (DMEMO.size > 800) DMEMO.clear();
  DMEMO.set(key, r);
  return r;
}

/* ปริมาณเพิ่ม x หน่วย (หน่วยเดียวกับที่ร้านกรอก) · สมาชิก: เพิ่มทั้งสมาชิก คนสมัครใหม่ และคนเลิก ในสัดส่วนเดิม */
function addVol(inp, m, x) {
  var o = Object.assign({}, inp);
  if (!x) return o;
  if (m === 'subscription') {
    var mem = n0(inp.members);
    if (mem > 0) return scaleVol(inp, m, Math.max(0, (mem + x) / mem));
    o.members = Math.max(0, x);
    return o;
  }
  var k = ROLE[m].vol;
  o[k] = Math.max(0, n0(inp[k]) + x);
  if (m === 'rental') o[k] = Math.min(100, o[k]); /* มีคนเช่าได้ไม่เกิน 100% ของห้องทั้งหมด */
  return o;
}

function rampOf(T, d) { return byMonth(T) || T === 'price' || T === 'supplier' ? 0 : Math.max(0, Math.round(n0(d.ramp))); }
/* เรื่องที่แต่ละเดือนไม่เหมือนกัน (ย้ายร้าน: ช่วงปิดร้านและลูกค้าค่อย ๆ กลับ · จัดโปร: ช่วงโปรกับหลังจบโปร) */
function byMonth(T) { return T === 'place' || T === 'promo'; }
function promoDur(d) { return Math.max(1, Math.round(n0(d.promoMonths) || 1)); }
/* ระดับของสิ่งที่คาดในเดือนที่ t: ใช้เวลา k เดือนค่อย ๆ ขึ้นเท่ากันทุกเดือน แล้วเต็มในเดือนที่ k + 1 (k = 0 เต็มตั้งแต่เดือนแรก) */
function levelAt(k, t) { return k > 0 ? Math.min(1, t / (k + 1)) : 1; }
/* ย้ายร้าน: เดือนแรกลูกค้าขาดไป dip% แล้วค่อย ๆ กลับมาครบในเดือนที่ back + 1 */
function placeProgress(d, t) {
  if (!(n0(d.dipPct) > 0)) return 1;
  var b = Math.max(1, Math.round(n0(d.backMonths) || 1));
  return Math.min(1, (t - 1) / b);
}
/* ตัวคูณฤดูกาลที่สูงที่สุดของปี (ใช้กันไม่ให้คนเช่ารวมทุกช่องทางเกิน 100% ในเดือนขายดี) */
function peakSeason(inp) { return hasSeason(inp) && (inp.season.high || []).length ? 1 + n0(inp.season.highPct) / 100 : 1; }

/* ---------- ช่องทางใหม่ = ทางรายได้ทางที่ 2 แบบเดียวกับร้าน แต่ราคา ต้นทุน และส่วนแบ่งของช่องทาง ---------- */
function channelStream(inp, m, d, q) {
  var c = Object.assign({}, inp, { growth: 0, capacity: null, maxMembers: null, maxConcurrent: null, maxDeals: null });
  if (isVolModel(m)) {
    c.volume = q;
    if (pos(d.chPrice)) c.price = pos(d.chPrice);
    c.unitCost = n0(inp.unitCost) + n0(d.extraCost);
  } else if (m === 'subscription') {
    var mem = n0(inp.members), r = mem > 0 ? q / mem : 0;
    c.members = q; c.newMembers = n0(inp.newMembers) * r; c.leaving = n0(inp.leaving) * r;
    if (pos(d.chPrice)) c.fee = pos(d.chPrice);
  } else if (m === 'project') {
    c.projectsPerYear = q;
    if (pos(d.chPrice)) c.projectValue = pos(d.chPrice);
  } else if (m === 'rental') {
    c.occupancy = q;
    if (pos(d.chPrice)) c.pricePerPeriod = pos(d.chPrice);
  } else if (m === 'commission') {
    c.dealsPerMonth = q;
  }
  var s = buildStream(c, m);
  s.id = 'ch'; s.name = d.chName || 'ช่องทางใหม่';
  s.variableCostPercent = Math.min(100, n0(d.cut));
  s.growthRatePercentMonthly = 0;
  return s;
}
/* ของใหม่ = ทางรายได้ทางที่ 2 ราคาและต้นทุนของตัวเอง ค่าธรรมเนียม % และวันเก็บสต็อกเท่าร้านเดิม */
/* ต่อคำไทยกับชื่อภาษาอังกฤษ ให้มีเว้นวรรค (ขายผ่าน TikTok) */
function tj(a, b) { return a + (/^[A-Za-z0-9]/.test(b) ? ' ' : '') + b; }
function npStream(inp, m, d, q) {
  var c = Object.assign({}, inp, { growth: 0, capacity: null, volume: q, price: n0(d.npPrice), unitCost: n0(d.npCost), unitLabel: npUnit(m) });
  var s = buildStream(c, m);
  s.id = 'np'; s.name = 'ของใหม่'; s.growthRatePercentMonthly = 0;
  return s;
}
/* สาขาที่ 2 = ร้านเดิมย่อส่วน f เท่า (ราคา ต้นทุน และกำลังรับเหมือนร้านเดิม) */
function branchStream(inp, m, f) {
  var c = scaleVol(inp, m, f);
  c.growth = 0;
  var s = buildStream(c, m);
  s.id = 'branch'; s.name = 'สาขา 2';
  return s;
}

/* ---------- แปลงการตัดสินใจเป็นข้อมูลของตัวคำนวณ ----------
   o.lv = ระดับของสิ่งที่คาด (0–1 ตามเดือน) · o.f = ตัวคูณของฉาก "ถ้าไม่เป็นอย่างที่คาด" · o.t = เดือนที่ (ใช้กับย้ายร้าน) */
function dBuild(inp, m, T, d, o) {
  var x = Object.assign({}, inp), streams = [], fx = [], assets = [], one = 0, note = {};
  var lv = o.lv === undefined ? 1 : o.lv, f = o.f === undefined ? 1 : o.f, g = lv * f;
  if (T === 'hire') {
    var c = Math.max(0, Math.round(n0(d.count)));
    if (isKind(d, 'part')) fx.push(['newstaff', 'ค่าจ้างพาร์ตไทม์ ' + c + ' คน', c * n0(d.partRate) * n0(d.partHours) * n0(d.partDays)]);
    else if (isKind(d, 'piece')) { c = 1; if (isVolModel(m)) x.unitCost = n0(inp.unitCost) + n0(d.pieceRate) * Math.min(100, n0(d.pieceShare)) / 100; }
    else fx.push(['newstaff', 'เงินเดือนพนักงานใหม่ ' + c + ' คน', c * n0(d.salary)]);
    x = addVol(x, m, n0(d.gain) * g);
    if (isVolModel(m) && pos(inp.capacity) && pos(d.capAdd)) x.capacity = pos(inp.capacity) + c * n0(d.capAdd);
  } else if (T === 'place') {
    var t = o.t || 0;
    var pf = Math.max(0, 1 + n0(d.salesPct) / 100) * f;
    if (t > 0) {
      pf *= 1 - Math.min(90, n0(d.dipPct)) / 100 * (1 - placeProgress(d, t));
      var dOpen = isVolModel(m) ? daysOf(inp) : 30;
      if (t === 1 && n0(d.closedDays) > 0) pf *= Math.max(0, 1 - Math.min(dOpen, n0(d.closedDays)) / dOpen);
    }
    x = scaleVol(x, m, pf);
    x.rent = n0(d.newRent);
    one = n0(d.moveCost);
  } else if (T === 'channel') {
    var q = n0(d.chQty) * g;
    var mv = Math.min(100, n0(d.movePct)) / 100;
    if (m === 'rental') {
      /* คนเช่ารวม (ร้าน − ที่ย้ายมา + ช่องทาง) ในเดือนขายดีที่สุดต้องไม่เกิน 100% */
      var cap = mv >= 1 ? Infinity : (100 / peakSeason(inp) - n0(inp.occupancy)) / (1 - mv);
      if (q > Math.max(0, cap) + 1e-9) { note.clamped = true; q = Math.max(0, cap); }
    }
    x = addVol(x, m, -q * mv);
    if (q > 0) streams.push(channelStream(inp, m, d, q));
    note.chQ = q;
    fx.push(['chfee', tj('ค่าใช้จ่ายรายเดือนของ', d.chName || 'ช่องทาง'), n0(d.chFee)]);
  } else if (T === 'equip') {
    x = addVol(x, m, n0(d.eqGain) * g);
    var ck = ROLE[m].cost;
    if (n0(d.costDown) > 0) x[ck] = Math.max(0, n0(inp[ck]) - n0(d.costDown) * f);
    if (isVolModel(m) && pos(inp.capacity) && pos(d.eqCap)) x.capacity = pos(inp.capacity) + n0(d.eqCap);
    var fc = n0(d.fixedChg);
    if (fc < 0) fc *= f; /* เงินที่ประหยัดได้เป็นผลที่คาด ค่าใช้จ่ายที่เพิ่มไม่ลดตามฉาก */
    fc = Math.max(fc, -fixedTotal(x));
    fx.push(['eqfix', fc < 0 ? 'ค่าใช้จ่ายรายเดือนที่ลดลง' : 'ค่าใช้จ่ายรายเดือนที่เพิ่มขึ้น', fc]);
    if (pos(d.price) && pos(d.life)) assets.push({ name: 'อุปกรณ์ใหม่', purchasePrice: pos(d.price), usefulLifeYears: pos(d.life) });
    one = n0(d.price);
  } else if (T === 'price') {
    var pk = ROLE[m].price, sh = isKind(d, 'some') ? Math.min(100, n0(d.raiseShare)) / 100 : 1;
    x[pk] = n0(inp[pk]) + n0(d.raiseBy) * sh;
    x = scaleVol(x, m, Math.max(0, 1 - Math.min(95, n0(d.lostPct)) / 100));
  } else if (T === 'promo') {
    if ((o.t || 0) > promoDur(d)) x = scaleVol(x, m, 1 + n0(d.afterPct) / 100);
    else {
      var use = isKind(d, 'code') ? Math.min(100, n0(d.usePct)) / 100 : 1;
      if (isKind(d, 'gift')) x.unitCost = n0(inp.unitCost) + n0(d.giftCost);
      else x.price = n0(inp.price) * (1 - Math.min(90, n0(d.discPct)) / 100 * use);
      x = scaleVol(x, m, Math.max(0, 1 + n0(d.lift) / 100 * f));
    }
    one = n0(d.promoCost);
  } else if (T === 'newprod') {
    var q2 = (isKind(d, 'addon') ? n0(inp.volume) * Math.min(100, n0(d.npAttach)) / 100 : n0(d.npQty)) * g;
    var cn = isKind(d, 'addon') ? 0 : Math.min(100, n0(d.npCanni)) / 100;
    x = addVol(x, m, -q2 * cn);
    if (q2 > 0) streams.push(npStream(inp, m, d, q2));
    note.npQ = q2;
    fx.push(['npfix', 'ค่าใช้จ่ายรายเดือนของของใหม่', n0(d.npFixed)]);
    one = n0(d.npSetup);
  } else if (T === 'freeship') {
    var shr = isKind(d, 'min') ? Math.min(100, n0(d.shipShare)) / 100 : 1, po = Math.max(1, n0(d.perOrder) || 1);
    x.unitCost = n0(inp.unitCost) + n0(d.shipCost) * shr / po;
    x = scaleVol(x, m, 1 + n0(d.shipLift) / 100 * g);
  } else if (T === 'ads') {
    fx.push(['adbudget', 'ค่าโฆษณา', n0(d.adBudget)], ['admgmt', 'ค่าจ้างคนดูแลโฆษณา', n0(d.adMgmt)]);
    x = addVol(x, m, n0(d.adGain) * g);
    one = n0(d.adSetup);
  } else if (T === 'supplier') {
    x.unitCost = n0(d.newCost);
    if (num(d.supStock) !== null) x.stockDays = n0(d.supStock);
    if (num(d.supCredit) !== null) x.supplierCreditDays = n0(d.supCredit);
    x = scaleVol(x, m, Math.max(0, 1 + n0(d.supSales) / 100) * f);
    one = n0(d.switchCost);
  } else if (T === 'freelance') {
    fx.push(['flfee', { admin: 'ค่าจ้างแอดมิน', live: 'ค่าจ้างคนไลฟ์' }[d.kind] || 'ค่าจ้างฟรีแลนซ์', n0(d.flFee)]);
    var gq = n0(d.flGain) * g;
    x = addVol(x, m, gq);
    if (isKind(d, 'live') && isVolModel(m) && n0(d.flPct) > 0) fx.push(['flcom', 'ค่าคอมคนไลฟ์', n0(d.flPct) / 100 * n0(inp.price) * (inp.volumePer === 'month' ? gq : gq * daysOf(inp))]);
  } else if (T === 'branch') {
    var bp = n0(d.bPct) / 100 * g;
    if (bp > 0) streams.push(branchStream(inp, m, bp));
    note.bp = bp;
    fx.push(['brent', 'ค่าเช่าสาขา', n0(d.bRent)], ['bstaff', 'เงินเดือนพนักงานสาขา', n0(d.bStaff) * n0(d.bSalary)], ['bother', 'ค่าใช้จ่ายอื่นของสาขา', n0(d.bOther)]);
    one = n0(d.setup);
  }
  /* ขายเป็นหน่วยแล้วยอดเหลือ 0 (เช่น ปิดร้านทั้งเดือน) ตัวคำนวณถือว่า "ไม่ทราบยอด" จึงใส่ยอดที่ใกล้ 0 มากแทน ให้ได้รายได้ 0 จริง */
  if (isVolModel(m) && !(n0(x.volume) > 0)) x.volume = 1e-9;
  var v4 = v4Input(x, m);
  v4.streams = v4.streams.concat(streams);
  v4.fixedCostsMonthly = Math.max(0, v4.fixedCostsMonthly + fx.reduce(function (s, a) { return s + a[2]; }, 0));
  if (assets.length) v4.assets = (v4.assets || []).concat(assets);
  /* ค่าส่ง ค่าจ้างรายชิ้น ของแถม ไม่ได้อยู่ในสต็อก: เงินจมในสต็อกคิดจากต้นทุนของเท่านั้น */
  if (isVolModel(m) && (T === 'freeship' || (T === 'hire' && isKind(d, 'piece')) || (T === 'promo' && isKind(d, 'gift')))) v4.streams[0].stockCostPerUnit = n0(inp.unitCost);
  return { v4: v4, x: x, fx: fx, one: one, note: note };
}

function steady(inp, m, T, d, f) {
  var b = dBuild(inp, m, T, d, { lv: 1, f: f === undefined ? 1 : f });
  var r = runCalc(b.v4);
  return { b: b, r: r, profit: r.netProfitMonthly };
}

/* ---------- เงินที่จมในการขาย (ลูกค้ายังไม่จ่าย + ของในสต็อก − เงินที่ลูกค้าจ่ายล่วงหน้า) ของเดือนปกติ ----------
   ตัวคำนวณคิดแต่ละเดือนแบบ "ร้านเป็นแบบนี้มานานแล้ว" เมื่อยอดเปลี่ยนวันนี้ เงินส่วนนี้ต้องจมเพิ่มก่อนจึงจะได้คืน
   ใช้กติกาจังหวะเงินเดียวกับตัวคำนวณ (เครดิตลูกค้า · วันเก็บสต็อก · เครดิตจากคนขาย · มัดจำและงวดสุดท้ายของงาน · ค่าสมาชิกจ่ายล่วงหน้า) */
function streamWC(s) {
  var cr = n0(s.creditDays);
  if (s.type === 'unit' || s.type === 'service' || s.type === 'resell') {
    var u = n0(s.unitsPerMonth), rev = n0(s.price) * u, cogs = n0(s.stockCostPerUnit !== undefined ? s.stockCostPerUnit : s.costPerUnit) * u;
    return rev * cr / 30 + cogs * (n0(s.inventoryDays) - n0(s.supplierCreditDays)) / 30;
  }
  if (s.type === 'subscription') {
    var cyc = Math.max(1, Math.round(n0(s.cycleMonths) || 1)), revS = n0(s.activeMembers) * n0(s.feePerCycle) / cyc;
    return revS * cr / 30 - revS * (cyc - 1) / 2;
  }
  if (s.type === 'rental') {
    var per = n0(s.periodsPerMonth) || 30;
    return n0(s.rentableUnits) * per * Math.min(1, n0(s.occupancyPercent) / 100) * n0(s.pricePerPeriod) * cr / 30;
  }
  if (s.type === 'commission') {
    var rc = n0(s.dealsPerMonth) * n0(s.avgDealValue) * n0(s.commissionPercent) / 100;
    return rc * (1 - (n0(s.splitPercent) + n0(s.variableCostPercent)) / 100) * cr / 30;
  }
  if (s.type === 'project') {
    var k = n0(s.projectsPerYear) / 12, V = n0(s.avgProjectValue), dd = Math.max(1, Math.round(n0(s.durationMonths))), p = n0(s.depositPercent) / 100;
    var L = Math.ceil(cr / 30 - 1e-9), w = 0;
    for (var a = 0; a <= dd - 2 + L; a++) w += V * Math.min(a + 1, dd) / dd - p * V;
    return k * w;
  }
  return n0(s.amountPerMonth) * cr / 30;
}
function wcOf(v4) { return v4.streams.reduce(function (a, s) { return a + streamWC(s); }, 0); }

/* ---------- ผลเต็มของการตัดสินใจ ---------- */
function dEval(inp, m, T, d, opt) {
  opt = opt || {};
  var f = opt.f === undefined ? 1 : opt.f;
  var B = compute(inp, m);
  if (!B.ok) return { ok: false };
  var st = steady(inp, m, T, d, f);
  if (st.r.netProfitMonthly === null || st.r.projection.length !== 12) return { ok: false };
  var k = rampOf(T, d);
  var R = { ok: true, T: T, m: m, B: B, st: st, one: st.b.one, k: k, f: f };
  R.profit = st.profit;
  R.delta = R.profit - B.profit;

  /* 12 เดือน: เดือนที่ t ใช้ตัวเลขของเดือนนั้นจากตัวคำนวณ (รวมฤดูกาล การเติบโต และจังหวะเงินเข้าออกของร้าน)
     แล้วหักเงินที่ต้องจมเพิ่มในลูกหนี้และสต็อก ในเดือนที่ยอดเปลี่ยน */
  var wc0 = wcOf(v4Input(inp, m)), prevWC = 0, rows = [];
  for (var t = 1; t <= 12; t++) {
    var o = byMonth(T) ? { t: t, f: f } : { lv: levelAt(k, t), f: f };
    var bt = byMonth(T) || o.lv !== 1 ? dBuild(inp, m, T, d, o) : st.b;
    var r = bt === st.b ? st.r : runCalc(bt.v4);
    var p = r.projection[t - 1];
    if (!p) return { ok: false };
    var dWC = wcOf(bt.v4) - wc0, wcStep = dWC - prevWC;
    prevWC = dWC;
    rows.push({ t: t, profit: p.netProfitAccounting, net: p.netCashFlow - wcStep, wcStep: wcStep, rev: p.revenue,
      bProfit: B.cash[t - 1].profit, bNet: B.cash[t - 1].net, bBal: B.cash[t - 1].bal });
  }
  R.wc = prevWC;
  R.cashStart = B.cashStart;
  R.aStart = B.cashStart - R.one;
  var bal = R.aStart, cum = 0, low = R.aStart, lowT = 0, negT = null, sumDiff = 0, payback = null;
  rows.forEach(function (w) {
    bal += w.net; w.bal = bal;
    if (bal < low) { low = bal; lowT = w.t; }
    if (negT === null && bal < 0) negT = w.t;
    sumDiff += w.profit - w.bProfit;
    var e = w.net - w.bNet, prev = cum;
    cum += e; w.cumExtra = cum;
    if (payback === null && R.one > 0 && cum >= R.one && e > 0) payback = w.t - 1 + (R.one - prev) / e;
  });
  if (R.aStart < 0 && negT === null) negT = 0;
  R.rows = rows;
  R.low = low; R.lowT = lowT; R.negT = negT;
  R.need = Math.max(0, -low);              /* เงินที่ต้องหาเพิ่ม ถึงจะไม่ขาดมือ */
  R.sumDiff = sumDiff;
  /* เงินสดที่ได้เพิ่มต่อเดือนเมื่อเข้าที่ (เดือนปกติ) = กำไรที่เปลี่ยน + เงินที่กันไว้ซื้อเครื่องใหม่ (ไม่ใช่เงินที่จ่ายออกจริง) */
  R.extraSteady = R.delta + (st.r.depreciation.monthlyTotal - B.r.depreciation.monthlyTotal);
  /* คืนทุนหลังเดือนที่ 12: ใช้เงินที่ได้เพิ่มของปีที่ 2 และ 3 จากตัวคำนวณ (รวมการเติบโตและฤดูกาลของร้าน) */
  if (R.one > 0 && payback === null) {
    var a3 = st.r.projection3YearsRough || [], b3 = B.r.projection3YearsRough || [], rem = R.one - cum;
    var y2 = a3[1] && b3[1] ? a3[1].netCashFlow - b3[1].netCashFlow : R.extraSteady * 12;
    var y3 = a3[2] && b3[2] ? a3[2].netCashFlow - b3[2].netCashFlow : y2;
    if (y2 > 0.5 && rem <= y2) payback = 12 + rem / (y2 / 12);
    else {
      var rem2 = rem - y2;
      if (y3 > 0.5 && rem2 <= y3) payback = 24 + rem2 / (y3 / 12);
      else if (y3 > 0.5) payback = 36 + (rem2 - y3) / (y3 / 12);
    }
  }
  if (R.extraSteady <= 0.5 || T === 'promo') payback = null;
  /* จัดโปร: กำไรรวม 12 เดือนเทียบกับไม่ทำ หักค่าจัดโปรแล้ว (ช่วงโปร + หลังจบโปร) */
  R.total12 = sumDiff - R.one;
  R.payback = R.one > 0 ? payback : null;
  R.ledger = dLedger(R, inp, m, T, d);
  R.warn = dWarn(R, inp, m, T, d);
  return R;
}

/* ---------- กำไรต่อเดือนเปลี่ยนเพราะอะไรบ้าง (รวมกันได้เท่ากำไรที่เปลี่ยนพอดี) ---------- */
function dLedger(R, inp, m, T, d) {
  var r0 = R.B.r, r1 = R.st.r, b = R.st.b, L = [];
  var c0 = r0.revenueMonthly - r0.variableCostMonthly, c1 = r1.revenueMonthly - r1.variableCostMonthly;
  var extra = r1.streams.slice(1).map(function (s) { return s.contributionMonthly || 0; });
  var extraSum = extra.reduce(function (a, x) { return a + x; }, 0);
  var mainChg = c1 - c0 - extraSum;
  var sw = salesWord(m);
  var mainLabel = {
    hire: isKind(d, 'piece') ? sw + 'ที่เพิ่ม หักค่าจ้างรายชิ้น' : 'เงินที่เหลือจาก' + sw + 'ที่เพิ่ม', place: 'เงินที่เหลือจาก' + sw + 'ที่ใหม่ เทียบกับตอนนี้',
    channel: tj('ลูกค้าเดิมที่ย้ายไปซื้อผ่าน', d.chName || 'ช่องทางใหม่'), equip: sw + 'ที่เพิ่ม และต้นทุนที่ลดลง', branch: '',
    price: 'ราคาใหม่ และ' + sw + 'ที่ลดลง', promo: (isKind(d, 'gift') ? 'ของแถม' : 'ส่วนลด') + ' และ' + sw + 'ที่เพิ่มช่วงจัดโปร',
    newprod: 'ลูกค้าที่เปลี่ยนจากของเดิมมาซื้อของใหม่', freeship: 'ค่าส่งที่ร้านจ่าย และ' + sw + 'ที่เพิ่ม', ads: 'เงินที่เหลือจาก' + sw + 'ที่เพิ่ม',
    supplier: 'ต้นทุนใหม่ และ' + sw + 'หลังเปลี่ยน', freelance: 'เงินที่เหลือจาก' + sw + 'ที่เพิ่ม'
  }[T];
  if (Math.abs(mainChg) >= 0.5) L.push({ label: mainLabel, amount: mainChg });
  r1.streams.slice(1).forEach(function (s, i) {
    L.push({ label: s.id === 'ch' ? tj('เงินที่เหลือจากขายผ่าน', d.chName || 'ช่องทางใหม่') : s.id === 'np' ? 'เงินที่เหลือจากขายของใหม่' : 'เงินที่เหลือจาก' + salesWord(m) + 'ของสาขา', amount: extra[i] });
  });
  var p0 = fixedParts(inp), p1 = fixedParts(b.x);
  if (Math.abs(p1.rent - p0.rent) >= 0.5) L.push({ label: 'ค่าเช่าที่ใหม่ เทียบกับที่เดิม', amount: -(p1.rent - p0.rent) });
  b.fx.forEach(function (a) { if (Math.abs(a[2]) >= 0.5) L.push({ label: a[1], amount: -a[2] }); });
  var dd = r1.depreciation.monthlyTotal - r0.depreciation.monthlyTotal;
  if (Math.abs(dd) >= 0.5) L.push({ label: 'กันไว้ซื้อเครื่องใหม่เมื่อหมดอายุ', amount: -dd });
  /* เศษจากการปัดของตัวคำนวณ ใส่ไว้ในบรรทัดแรก เพื่อให้รวมกันได้เท่ากำไรที่เปลี่ยนพอดี */
  var sum = L.reduce(function (a, x) { return a + x.amount; }, 0);
  if (L.length && Math.abs(R.delta - sum) > 0.001) L[0].amount += R.delta - sum;
  return L;
}

function dWarn(R, inp, m, T, d) {
  var W = [], x = R.st.b.x;
  if (isVolModel(m) && pos(x.capacity) && ['hire', 'equip', 'ads', 'freelance', 'promo', 'freeship', 'supplier'].indexOf(T) >= 0) {
    var mainV = n0(x.volume), chV = T === 'channel' ? n0(R.st.b.note.chQ) : 0;
    if (mainV + chV > pos(x.capacity) + 1e-9) W.push('ยอดที่คาดรวม ' + fmtN(mainV + chV, 1) + ' ' + volUnitText(inp, m) + ' เกินกำลังที่ร้านทำได้ (สูงสุด ' + fmtN(pos(x.capacity)) + ')');
  }
  if (m === 'subscription' && pos(inp.maxMembers) && T !== 'branch') {
    var tot = n0(x.members) + (T === 'channel' ? n0(R.st.b.note.chQ) : 0);
    if (tot > pos(inp.maxMembers)) W.push('สมาชิกที่คาดรวม ' + fmtN(tot) + ' คน เกินที่รับได้ (สูงสุด ' + fmtN(pos(inp.maxMembers)) + ' คน)');
  }
  if (T === 'channel' && R.st.b.note.clamped) W.push('คนเช่ารวมทุกช่องทางเต็ม 100% ในเดือนขายดีแล้ว ส่วนที่เกินไม่ได้นับ');
  if (T === 'channel') { var u = channelUnit(inp, m, d); if (u && u.ch <= 0) W.push('ขายผ่านช่องทางนี้ ' + (u.ch < 0 ? 'ยิ่งขายยิ่งขาดทุน' : 'ไม่เหลือเงินเลย') + ' เพราะส่วนแบ่งและต้นทุนเกินราคาขาย'); }
  if (T === 'equip' && R.payback !== null && pos(d.life) && R.payback > pos(d.life) * 12) W.push('คืนทุนช้ากว่าอายุใช้งานของเครื่อง (' + fmtN(pos(d.life)) + ' ปี)');
  if (Math.abs(R.wc) >= 1000) W.push(R.wc > 0 ? 'มีเงินจมอยู่กับลูกค้าที่ยังไม่จ่ายและของในสต็อกเพิ่มขึ้นราว ' + fmtN(R.wc) + ' บาท นับไว้ในเงินสดแล้ว'
    : 'ได้เงินที่จมอยู่กับลูกค้าและของในสต็อกคืนมาราว ' + fmtN(-R.wc) + ' บาท นับไว้ในเงินสดแล้ว');
  return W;
}

/* ---------- หาค่าที่ทำให้กำไรต่อเดือนเท่าเดิม (กำไรเปลี่ยนเป็นเส้นตรงตามตัวเลขเกือบทุกกรณี จึงใช้วิธีเส้นตรงซ้ำแล้วยืนยันด้วยการคำนวณจริง) ---------- */
function solveFor(fn, target, x0, x1, lo, hi) {
  var f0 = fn(x0) - target, f1 = fn(x1) - target;
  for (var i = 0; i < 16; i++) {
    if (Math.abs(f1) < 0.5) return x1;
    var s = (f1 - f0) / (x1 - x0);
    if (!isFinite(s) || Math.abs(s) < 1e-9) return null;
    var x2 = x1 - f1 / s;
    if (x2 < lo) x2 = lo; if (x2 > hi) x2 = hi;
    if (Math.abs(x2 - x1) < 1e-9) return Math.abs(f1) < 1 ? x1 : null;
    x0 = x1; f0 = f1; x1 = x2; f1 = fn(x1) - target;
  }
  return Math.abs(f1) < 1 ? x1 : null;
}
/* จุดคุ้มของตัวเลข 1 ตัว (กำไรเทียบกับตอนนี้)
   value = ต้องได้อย่างน้อย x · zero = ค่าต่ำสุดก็คุ้มแล้ว · max = ยิ่งมากยิ่งได้น้อยลง ต้องไม่เกิน x
   always = กำไรไม่ขยับตามตัวเลขนี้ และคุ้มอยู่แล้ว · never = ไม่มีค่าไหนคุ้ม (why: rev ยิ่งมากยิ่งได้น้อยลง · flat กำไรไม่ขยับ · far ต้องมากเกินจริง) */
function breakEven(fn, base, lo, step, hi) {
  var p0 = fn(lo), p1 = fn(lo + step), slope = p1 - p0;
  if (slope > 0.01) {
    if (p0 >= base - 0.5) return { kind: 'zero', x: lo };
    var x = solveFor(fn, base, lo, lo + step, lo, hi);
    return x === null ? { kind: 'never', why: 'far' } : { kind: 'value', x: x };
  }
  if (slope < -0.01) {
    if (p0 < base - 0.5) return { kind: 'never', why: 'rev' };
    if (p0 < base + 0.5) return { kind: 'never', why: 'rev', even: true }; /* ที่ค่าต่ำสุดกำไรเท่าเดิมพอดี เพิ่มเท่าไรก็น้อยลง */
    var xm = solveFor(fn, base, lo, lo + step, lo, hi);
    if (xm === null && fn(hi) >= base - 0.5) return { kind: 'always' }; /* ถึงปลายช่วงแล้วก็ยังไม่น้อยกว่าตอนนี้ */
    return xm === null || xm <= lo + step * 0.01 ? { kind: 'never', why: 'rev' } : { kind: 'max', x: xm };
  }
  return p0 >= base - 0.5 ? { kind: 'always' } : { kind: 'never', why: 'flat' };
}
function withD(d, k, v) { var o = Object.assign({}, d); o[k] = v; return o; }

/* เงินที่เหลือต่อหน่วย ขายเอง กับ ขายผ่านช่องทางใหม่ (คำนวณด้วยตัวคำนวณจากทางรายได้ทางเดียว) */
function channelUnit(inp, m, d) {
  var q = n0(d.chQty) > 0 ? n0(d.chQty) : 1;
  var rc = runCalc({ streams: [channelStream(inp, m, d, q)], fixedCostsMonthly: 0, planStartMonth: START_MONTH, daysOpenPerMonth: isVolModel(m) ? daysOf(inp) : null });
  var rb = runCalc({ streams: [buildStream(addVol(Object.assign({}, inp, { growth: 0 }), m, q - n0(inp[ROLE[m].vol])), m)], fixedCostsMonthly: 0, planStartMonth: START_MONTH, daysOpenPerMonth: isVolModel(m) ? daysOf(inp) : null });
  var cc = rc.streams[0].contributionMonthly, cb = rb.streams[0].contributionMonthly;
  if (cc === null || cb === null) return null;
  /* ต่อหน่วยที่ร้านเข้าใจ: ต่อชิ้น/ครั้ง · ต่อสมาชิกต่อเดือน · ต่องาน · ต่อคืนที่มีคนเช่า · ต่อดีล */
  var per = 1;
  if (isVolModel(m)) per = inp.volumePer === 'month' ? 1 : daysOf(inp);
  else if (m === 'project') per = 1 / 12;
  else if (m === 'rental') per = n0(inp.rentableUnits) * (inp.periodKind === 'month' ? 1 : 30) / 100;
  if (!(per > 0)) return null;
  return { ch: cc / q / per, own: cb / q / per };
}
/* ราคาบนช่องทางที่เหลือเงินต่อหน่วยเท่าขายเอง */
function channelEqualPrice(inp, m, d) {
  if (m === 'commission') return null;
  var cu = channelUnit(inp, m, d);
  if (!cu) return null;
  var curP = n0(inp[ROLE[m].price]);
  var p = solveFor(function (x) { var u2 = channelUnit(inp, m, withD(d, 'chPrice', x)); return u2 ? u2.ch : 0; }, cu.own, curP, curP * 1.2 + 1, 0, curP * 50 + 1e5);
  return p === null ? null : Math.ceil(p - 1e-9);
}

function roundDown(x, m) {
  if (x === null) return null;
  if (m === 'rental' || m === 'subscription') return Math.floor(x + 1e-9);
  return x < 10 ? Math.floor(x * 10 + 1e-9) / 10 : Math.floor(x + 1e-9);
}
function roundNeed(x, m) {
  if (x === null) return null;
  if (m === 'rental' || m === 'subscription') return Math.ceil(x - 1e-9);
  return x < 10 ? Math.ceil(x * 10 - 1e-9) / 10 : Math.ceil(x - 1e-9);
}
/* ตัวเลขที่แสดงบนจอ: เงื่อนไขปัดขึ้น · ค่าที่ใช้ดูปัดตามปกติ · ตัดสิน ✓ ✕ จากตัวเลขที่แสดงเสมอ ไม่ให้ขัดกันบนจอ
   ย้ายร้าน: ยอดที่ใหม่มาจาก % ที่กรอก จึงมีทศนิยม แสดงทศนิยม 1 ตำแหน่ง */
function showNeed(P, x, m) {
  if (x === null || x === undefined) return null;
  if (P.T === 'branch') return Math.ceil(x - 1e-9);
  if (P.prec && x >= 10) return Math.ceil(x * 10 - 1e-9) / 10;
  return roundNeed(x, m);
}
function showVal(v) { return Math.abs(v) < 1000 ? Math.round(v * 10) / 10 : Math.round(v); }
/* ทศนิยมที่แสดง: อย่างน้อยเท่ากับตัวเลขที่ผู้ใช้กรอก (สูงสุด 2 ตำแหน่ง) เงื่อนไขกับค่าที่ใช้ดูจึงเทียบกันได้ตรง ๆ
   ค่าที่ใช้ดูปัดไปทางที่ไม่ทำให้ดูผ่านเกินจริง (อย่างน้อย → ปัดลง · ไม่เกิน → ปัดขึ้น) */
function decOf(v) { v = Math.abs(v); if (v >= 1000) return 0; for (var k = 0; k < 2; k++) { var f = Math.pow(10, k); if (Math.abs(v * f - Math.round(v * f)) < 1e-6) return k; } return 2; }
function needAt(P, x, m, have) {
  var s = showNeed(P, x, m);
  if (s === null) return null;
  var pd = Math.max(decOf(s), decOf(have)), f = Math.pow(10, pd);
  return pd > decOf(s) ? Math.ceil(x * f - 1e-9) / f : s;
}
function downAt(x, m, have) {
  var s = roundDown(x, m), pd = Math.max(decOf(s), decOf(have)), f = Math.pow(10, pd);
  return pd > decOf(s) ? Math.floor(x * f + 1e-9) / f : s;
}
function haveAt(v, s, lo) { var pd = Math.max(decOf(s), decOf(v)), f = Math.pow(10, pd); return lo ? Math.floor(v * f + 1e-6) / f : Math.ceil(v * f - 1e-6) / f; }
function payIn(x) { return x === null || x === undefined ? 'ไม่ได้' : x > 120 ? 'เกิน 10\u00a0ปี' : 'ใน ' + fmtMonths(x); }

/* ---------- ตัวเลขหลักที่ตัดสินว่าคุ้มไหม (แถบลากในหน้าผล) ----------
   key = ช่องของการตัดสินใจ · ค่าบนแถบเป็นหน่วยที่ร้านเข้าใจ (ย้ายร้าน: ยอดที่ใหม่ แทน % ที่กรอก) */
var PMEMO = new Map();
function dPivot(inp, m, T, d) {
  var pk = pivotKey(T, d);
  var dk = Object.assign({}, d); delete dk[pk];
  var key = T + '|' + m + '|' + JSON.stringify(inp) + '|' + JSON.stringify(dk);
  var P0 = PMEMO.get(key);
  if (!P0) { P0 = dPivot0(inp, m, T, d); if (PMEMO.size > 200) PMEMO.clear(); PMEMO.set(key, P0); }
  var P = Object.assign({}, P0);
  P.have = P.get(d);
  return P;
}
/* ตัวเลขหลักบนแถบลากของแต่ละเรื่อง */
var PCT_PIV = { price: 'lostPct', promo: 'lift', freeship: 'shipLift' };
function pivotKey(T, d) {
  return { hire: 'gain', equip: 'eqGain', ads: 'adGain', freelance: 'flGain', place: 'salesPct', supplier: 'supSales', channel: 'chQty', branch: 'bPct',
    price: 'lostPct', promo: 'lift', freeship: 'shipLift', newprod: d && d.kind === 'addon' ? 'npAttach' : 'npQty' }[T];
}
function dPivot0(inp, m, T, d) {
  var cur = n0(inp[ROLE[m].vol]), u = gainUnit(inp, m), sw = salesWord(m);
  var P = { T: T, unit: u, key: pivotKey(T, d) };
  if (T === 'hire' || T === 'equip' || T === 'ads' || T === 'freelance') {
    P.get = function (dd) { return n0(dd[P.key]); };
    P.set = function (dd, v) { return withD(dd, P.key, Math.max(0, v)); };
    P.q = 'ต้อง' + gainWord(m) + 'เท่าไร ถึงจะคุ้ม' + { hire: isKind(d, 'full') || !d.kind ? 'เงินเดือนคนใหม่' : 'ค่าจ้างคนใหม่', equip: 'ค่าเครื่อง', ads: 'ค่าโฆษณา', freelance: 'ค่าจ้าง' }[T];
    P.lab = 'ต้อง' + gainWord(m);
    P.word = gainWord(m);
    P.lo = 0;
  } else if (PCT_PIV[T]) {
    P.get = function (dd) { return n0(dd[P.key]); };
    P.set = function (dd, v) { return withD(dd, P.key, Math.max(0, Math.min(T === 'price' ? 95 : 1000, v))); };
    P.unit = '%';
    P.pct = true;
    P.q = T === 'price' ? sw + 'ลดลงได้มากสุดเท่าไร ถึงจะยังคุ้ม' : T === 'promo' ? 'ช่วงจัดโปร ' + sw + 'ต้องเพิ่มเท่าไร ถึงจะคุ้ม' : sw + 'ต้องเพิ่มเท่าไร ถึงจะคุ้มค่าส่ง';
    P.word = T === 'price' ? sw + 'ลดลง' : T === 'promo' ? 'ช่วงโปร' + sw + 'เพิ่มขึ้น' : sw + 'เพิ่มขึ้น';
    P.lab = T === 'price' ? sw + 'ลดลงได้' : T === 'promo' ? 'ช่วงโปร' + sw + 'ต้องเพิ่ม' : sw + 'ต้องเพิ่ม';
    P.lo = 0;
    P.showHave = true;
  } else if (T === 'newprod') {
    P.get = function (dd) { return n0(dd[P.key]); };
    P.set = function (dd, v) { return withD(dd, P.key, Math.max(0, P.key === 'npAttach' ? Math.min(100, v) : v)); };
    if (P.key === 'npAttach') { P.unit = '% ของ' + U(inp, m) + 'ที่ขาย'; P.word = 'ลูกค้าซื้อพ่วง'; P.lab = 'ลูกค้าต้องซื้อพ่วง'; P.q = 'ลูกค้าต้องซื้อพ่วงกี่ % ถึงจะคุ้ม'; }
    else { P.unit = npUnit(m) + '/' + perWord(inp); P.word = 'ของใหม่ขายได้'; P.lab = 'ของใหม่ต้องขายได้'; P.q = 'ของใหม่ต้องขายได้เท่าไร ถึงจะคุ้ม'; }
    P.lo = 0;
  } else if (T === 'supplier') {
    P.get = function (dd) { return cur * (1 + n0(dd.supSales) / 100); };
    P.set = function (dd, v) { return withD(dd, 'supSales', cur > 0 ? (v / cur - 1) * 100 : 0); };
    P.verb = m === 'service' ? 'มีลูกค้า' : 'ขายได้';
    P.q = 'หลังเปลี่ยน ต้อง' + P.verb + 'เท่าไร ถึงจะคุ้ม';
    P.word = sw + 'หลังเปลี่ยน';
    P.lab = 'หลังเปลี่ยนต้อง' + P.verb;
    P.lo = cur * 0.1;
    P.now = cur;
    P.prec = cur < 1000 ? 1 : 0;
    P.showHave = true;
  } else if (T === 'place') {
    P.key = 'salesPct';
    P.get = function (dd) { return cur * (1 + n0(dd.salesPct) / 100); };
    P.set = function (dd, v) { return withD(dd, 'salesPct', cur > 0 ? (v / cur - 1) * 100 : 0); };
    P.verb = { rental: 'มีคนเช่า', subscription: 'มีสมาชิก', project: 'ได้งาน', commission: 'ปิดดีลได้', other: 'ได้เงิน' }[m] || (m === 'service' ? 'มีลูกค้า' : 'ขายได้');
    P.q = 'ที่ใหม่ต้อง' + P.verb + 'เท่าไร ถึงจะคุ้ม';
    P.word = salesWord(m) + 'ที่ใหม่';
    P.lab = 'ที่ใหม่ต้อง' + P.verb;
    P.lo = cur * 0.1;
    P.now = cur;
    P.prec = m !== 'rental' && m !== 'subscription' && cur < 1000 ? 1 : 0;
    P.showHave = true;
  } else if (T === 'channel') {
    P.key = 'chQty';
    P.get = function (dd) { return n0(dd.chQty); };
    P.set = function (dd, v) { return withD(dd, 'chQty', Math.max(0, v)); };
    var chn = d.chName || 'ช่องทางนี้';
    P.word = { subscription: tj('ได้สมาชิกผ่าน', chn), project: tj('ได้งานผ่าน', chn), rental: tj('มีคนเช่าผ่าน', chn), commission: tj('ปิดดีลผ่าน', chn) + 'ได้' }[m] || tj('ขายผ่าน', chn) + 'ได้';
    P.q = 'ต้อง' + P.word + 'เท่าไร ถึงจะคุ้ม';
    P.lab = 'ต้อง' + P.word;
    if (m === 'rental') P.unit = '% ของทั้งหมด';
    P.lo = 0;
  } else {
    P.key = 'bPct';
    P.get = function (dd) { return n0(dd.bPct); };
    P.set = function (dd, v) { return withD(dd, 'bPct', Math.max(0, v)); };
    P.q = 'สาขาต้องมี' + salesWord(m) + 'เท่าไร ถึงจะคุ้ม';
    P.word = 'สาขามี' + salesWord(m);
    P.lab = 'สาขาต้องมี' + salesWord(m);
    P.unit = '% ของร้านเดิม';
    P.lo = 0;
    P.showHave = true;
  }
  var base = compute(inp, m).profit;
  var volPiv = T === 'place' || T === 'supplier', pctLike = P.pct || P.key === 'npAttach' || T === 'branch';
  var step = Math.max(1e-3, volPiv ? cur * 0.1 : Math.max(1, cur * 0.1));
  if (pctLike) step = 10;
  var bhi = T === 'branch' ? 1000 : T === 'price' ? 95 : P.key === 'npAttach' ? 100 : P.pct ? 1000 : Math.max(cur * 50, 1e6);
  var be = breakEven(function (v) { return steady(inp, m, T, P.set(d, v)).profit; }, base, P.lo, step, bhi);
  P.be = be;
  P.need = be.kind === 'value' ? be.x : be.kind === 'zero' ? P.lo : null;
  var ref = Math.max(P.get(d) || 0, P.need || 0, P.be.kind === 'max' ? P.be.x : 0, volPiv ? cur : 0, T === 'branch' ? 100 : pctLike ? 20 : phGain(inp, m));
  P.hi = volPiv ? Math.max(cur * 1.6, ref * 1.3) : ref * 1.6;
  if (T === 'price') P.hi = Math.min(95, P.hi);
  if (P.key === 'npAttach') P.hi = Math.min(100, P.hi);
  if (m === 'rental' && (T === 'hire' || T === 'equip' || T === 'channel')) P.hi = Math.min(P.hi, Math.max(10, 100 - n0(inp.occupancy) + (T === 'channel' ? n0(inp.occupancy) : 0)));
  P.step = niceStep(Math.max(P.hi - P.lo, 1) / 60);
  if (isVolModel(m) && inp.volumePer !== 'month' && P.step < 1 && T !== 'branch') P.step = P.hi > 20 ? 1 : 0.5;
  if (m === 'subscription' || m === 'rental' || pctLike) P.step = Math.max(1, Math.round(P.step));
  P.hi = Math.ceil(P.hi / P.step) * P.step;
  if (T === 'price') P.hi = Math.min(95, P.hi);
  if (P.key === 'npAttach') P.hi = Math.min(100, P.hi);
  P.lo = Math.floor(P.lo / P.step) * P.step;
  P.scen = { hire: [[0, 'ไม่ได้เลย'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']], equip: [[0, 'ไม่ได้เลย'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']],
    channel: [[0, 'ไม่มีคนซื้อ'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']], place: [[0.8, 'ต่ำกว่าคาด 20%'], [0.9, 'ต่ำกว่าคาด 10%'], [1, 'ที่คุณคาด']],
    branch: [[0.5, 'ครึ่งเดียว'], [0.8, 'ต่ำกว่าคาด 20%'], [1, 'ที่คุณคาด']],
    ads: [[0, 'ไม่ได้เลย'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']], freelance: [[0, 'ไม่ได้เลย'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']],
    newprod: [[0, 'ขายไม่ได้เลย'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']], supplier: [[0.9, 'ต่ำกว่าคาด 10%'], [0.95, 'ต่ำกว่าคาด 5%'], [1, 'ที่คุณคาด']],
    price: [[0, 'ไม่มีใครหาย', 'abs'], [1, 'ที่คุณคาด'], [2, 'หาย 2 เท่า']],
    promo: [[0, 'ยอดไม่เพิ่ม', 'abs'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']], freeship: [[0, 'ยอดไม่เพิ่ม', 'abs'], [0.5, 'ครึ่งเดียว'], [1, 'ที่คุณคาด']] }[T];
  /* เรื่องที่มีเงินก้อน: กำไรต่อเดือนเท่าเดิมยังไม่พอ ต้องได้เงินก้อนคืนด้วย
     เป้าคืนทุน = อายุเครื่อง (ซื้ออุปกรณ์) หรือ 3 ปี (ย้ายร้าน เปิดสาขา) แล้วหาค่าที่ทำให้คืนทุนทันเป้า */
  var one = dBuild(inp, m, T, d, { lv: 1, f: 1 }).one;
  P.one = one;
  /* ยอดสูงสุดที่ร้านทำได้ (ย้ายร้าน สาขา) ใช้บอกว่าเงื่อนไขเกินกำลังร้าน */
  P.capMax = null;
  if (volPiv) P.capMax = m === 'rental' ? 100 : isVolModel(m) && pos(inp.capacity) ? pos(inp.capacity) : null;
  if (T === 'branch') P.capMax = m === 'rental' && pos(inp.occupancy) ? 100 * 100 / pos(inp.occupancy) : isVolModel(m) && pos(inp.capacity) && cur > 0 ? pos(inp.capacity) / cur * 100 : null;
  if (P.capMax !== null) P.capTxt = m === 'rental' ? 'คนเช่าเต็มทุก' + U(inp, m) : (T === 'branch' ? 'สาขา' : 'ที่ใหม่') + 'ขายเต็มกำลังร้าน ' + fmtN(pos(inp.capacity)) + '\u00a0' + gainUnit(inp, m);
  if (!volPiv && T !== 'branch' && isVolModel(m) && cur > 0 && ['hire', 'equip', 'ads', 'freelance', 'promo', 'freeship'].indexOf(T) >= 0) {
    var cb = pos(dBuild(inp, m, T, d, { lv: 1, f: 1 }).x.capacity);
    if (cb) { P.capMax = P.pct ? (cb / cur - 1) * 100 : cb - cur; P.capTxt = 'ร้านขายเต็มกำลัง ' + fmtN(cb) + '\u00a0' + gainUnit(inp, m); P.capNote = 'ร้านทำได้สูงสุด ' + fmtN(cb) + ' ' + gainUnit(inp, m); }
  }
  P.needOver = P.need !== null && P.capMax !== null && P.need > P.capMax + 1e-9;
  /* เป้าคืนทุน 3 ปี: เฉพาะเรื่องที่มีเงินก้อนใหญ่ที่กำไรต่อเดือนยังไม่ได้นับ (ซื้ออุปกรณ์หักค่าเสื่อมในกำไรแล้ว · จัดโปรจบในปี) */
  if (one > 0 && (T === 'place' || T === 'branch' || T === 'newprod') && (be.kind === 'value' || be.kind === 'zero')) {
    P.target = 36;
    P.targetTxt = 'คืนทุนภายใน 3\u00a0ปี';
    var pb = function (v) { var R = dEval(inp, m, T, P.set(d, v)); return R.ok && R.payback !== null ? R.payback : Infinity; };
    var lo2 = Math.max(P.lo, P.need || P.lo), hi2 = Math.max(P.hi, (P.need || 0) * 2, 1) * 4;
    P.payNeed = null; P.payNo = 'ยอดเท่าไรก็คืนทุนไม่ทันใน 3\u00a0ปี';
    if (pb(hi2) <= P.target) {
      for (var i = 0; i < 26; i++) { var mid = (lo2 + hi2) / 2; if (pb(mid) <= P.target) hi2 = mid; else lo2 = mid; }
      if (P.capMax !== null && hi2 > P.capMax + 1e-9) P.payNo = 'ต่อให้' + P.capTxt + ' ก็คืนทุนไม่ทันใน 3\u00a0ปี';
      else if (P.need !== null && hi2 - P.need < P.step) { P.target = null; P.targetTxt = null; } /* เงินก้อนเล็ก: คืนทุน 3 ปีที่จุดเดียวกับจุดคุ้ม ไม่ต้องแยกบอก */
      else {
        P.payNeed = hi2;
        if (P.payNeed > P.hi) { P.hi = Math.ceil(P.payNeed * 1.15 / P.step) * P.step; }
      }
    }
  }
  return P;
}
function needText(P, m, inp, d) {
  var b = P.be;
  if (b.kind === 'always') return 'คุ้มไม่ว่า' + P.word + 'จะเป็นเท่าไร';
  if (b.kind === 'zero') return P.T === 'place' || P.T === 'supplier' ? 'ยอดลดลงได้มากก็ยังคุ้ม' : P.T === 'channel' ? 'ขายได้เท่าไรก็คุ้ม เพราะไม่มีค่าใช้จ่ายประจำของช่องทาง'
    : P.T === 'newprod' ? 'ไม่มีค่าใช้จ่ายประจำของของใหม่ กำไรต่อเดือนจึงไม่ลด ไม่ว่าจะ' + (P.key === 'npAttach' ? 'ซื้อพ่วง' : 'ขายได้') + 'เท่าไร'
    : P.T === 'equip' ? 'ไม่ต้องขายเพิ่มก็คุ้มแล้ว จากต้นทุนที่ลดลง' : P.pct ? salesWord(m) + 'ไม่ต้องเพิ่มก็คุ้มแล้ว' : 'ไม่ต้อง' + P.word + 'ก็คุ้มแล้ว';
  if (P.T === 'price' && b.kind === 'max') return 'ถ้า' + salesWord(m) + 'ลดลงมากกว่านี้ กำไรต่อเดือนจะน้อยกว่าตอนนี้';
  if (P.T === 'price' && b.why === 'rev') return b.even ? 'ราคาเท่าเดิม ' + salesWord(m) + 'ลดลงเท่าไร กำไรก็ลดลง' : 'ราคาใหม่ยังทำให้กำไรน้อยกว่าตอนนี้ แม้ไม่มีใครหาย';
  if (b.why === 'rev' || b.kind === 'max') {
    if (P.T === 'promo' || P.T === 'freeship') return 'ยิ่งขายมากยิ่งได้น้อยลง เพราะหลัง' + (P.T === 'freeship' ? 'จ่ายค่าส่ง' : isKind(d, 'gift') ? 'แถมของ' : 'ลดราคา') + 'แล้ว ขายแล้วไม่เหลือเงิน';
    if (P.T === 'newprod') return 'ยิ่งขายของใหม่มากยิ่งได้น้อยลง เพราะลูกค้าเปลี่ยนจากของเดิมที่เหลือเงินมากกว่า';
    var cu = P.T === 'channel' ? channelUnit(inp, m, d) : null;
    if (cu && cu.ch > 0) return 'ยิ่งขายผ่านช่องทางนี้มากยิ่งได้น้อยลง เพราะลูกค้าเดิมย้ายมามากเกินไป';
    return 'ยิ่งขายมากยิ่งได้น้อยลง เพราะขายแล้วไม่เหลือเงิน';
  }
  if (b.why === 'flat') return m === 'rental' ? 'รับเพิ่มไม่ได้แล้ว เพราะคนเช่าเต็มทุก' + U(inp, m) : m === 'subscription' ? 'รับเพิ่มไม่ได้แล้ว เพราะสมาชิกเต็มที่รับได้' : 'เพิ่มเท่าไรกำไรก็ไม่ขยับ';
  return 'เพิ่มเท่าไรก็ยังไม่คุ้ม';
}

/* ---------- สิ่งที่ต้องเป็นจริง ถึงจะคุ้ม ----------
   แต่ละแถว: id · label · value · unit · have (ตัวเลขที่ใช้ดูอยู่) · status ok/short/info · sub · lever (ช่องที่ปรับได้) */
function dConds(R, inp, m, T, d) {
  var C = [], base = R.B.profit, P = dPivot(inp, m, T, d), u = P.unit;
  function profitWith(dd) { return steady(inp, m, T, dd).profit; }
  /* 1) จุดคุ้มของตัวเลขหลัก */
  var nr = { id: 'need', lever: P.key, unit: u, have: P.have, raw: P.need };
  var over = P.needOver ? ' · เกินกำลังที่' + (T === 'branch' ? 'สาขา' : 'ร้าน') + 'ทำได้ (' + (P.capNote || (m === 'rental' ? 'คนเช่าเต็มทุก' + U(inp, m) : fmtN(pos(inp.capacity)) + ' ' + gainUnit(inp, m))) + ')' : '';
  if (P.be.kind === 'value') {
    var shown = needAt(P, P.need, m, P.have), hv = haveAt(P.have, shown, true);
    var depM = T === 'equip' ? R.st.r.depreciation.monthlyTotal - R.B.r.depreciation.monthlyTotal : 0;
    var same = 'ถึงจะได้กำไรต่อเดือน' + (T === 'promo' ? 'ช่วงจัดโปร' : '') + 'เท่าตอนนี้' + (T === 'equip' && depM > 0.5 ? ' (หักเงินที่กันไว้ซื้อเครื่องใหม่ เดือนละ ' + fmtN(depM) + ' บาทแล้ว)'
      : P.one > 0 ? ' (ยังไม่นับ' + (T === 'promo' ? 'ค่าจัดโปร ' : 'เงินก้อน ') + fmtN(P.one) + ' บาท)' : '');
    Object.assign(nr, { label: P.lab + 'อย่างน้อย', value: shown, haveShown: hv,
      status: hv >= shown - 1e-9 && !P.needOver ? 'ok' : 'short',
      sub: (P.now !== undefined ? (P.need >= P.now ? salesWord(m) + 'มากกว่าตอนนี้ ' : salesWord(m) + 'น้อยกว่าตอนนี้ ') + fmtPct(Math.abs(P.need / P.now - 1) * 100) + ' ' + same
        : T === 'branch' ? '= ' + (m === 'rental' ? 'มีคนเช่า ' + fmtN(roundNeed(n0(inp.occupancy) * P.need / 100, m)) + '% ของ' + U(inp, m) + 'ทั้งหมดที่สาขา' : fmtN(roundNeed(n0(inp[ROLE[m].vol]) * P.need / 100, m)) + ' ' + gainUnit(inp, m)) + ' ' + same
          : same) + over });
  } else {
    var mx0 = P.be.kind === 'max' ? downAt(P.be.x, m, P.have) : null, hx = mx0 !== null ? haveAt(P.have, mx0, false) : null;
    if (P.be.kind === 'max') Object.assign(nr, { label: P.lab + 'ไม่เกิน', value: mx0, raw: P.be.x, haveShown: hx,
      status: hx <= mx0 + 1e-9 ? 'ok' : 'short', sub: needText(P, m, inp, d) });
    else Object.assign(nr, { label: P.q, value: null, txt: needText(P, m, inp, d), status: P.be.kind === 'never' ? 'short' : 'ok' });
  }
  C.push(nr);
  /* 1b) เรื่องที่มีเงินก้อน: ต้องได้เท่าไรถึงจะคืนทุนทันเป้า */
  if (P.target) {
    var pn = needAt(P, P.payNeed, m, P.have), hp = pn !== null ? haveAt(P.have, pn, true) : null;
    if (pn !== null) C.push({ id: 'payneed', label: 'ถ้าจะ' + P.targetTxt + ' ' + P.lab + 'อย่างน้อย', value: pn,
      raw: P.payNeed, unit: u, have: P.have, haveShown: hp, lever: P.key, status: hp >= pn - 1e-9 ? 'ok' : 'short',
      sub: 'นับเงินก้อน ' + fmtN(P.one) + ' บาทด้วย · 3 ปีเป็นระยะที่ใช้เทียบเท่านั้น' });
    else C.push({ id: 'payneed', label: 'ถ้าจะ' + P.targetTxt, value: null, txt: P.payNo, unit: u, lever: P.key, status: 'short', sub: 'นับเงินก้อน ' + fmtN(P.one) + ' บาทด้วย · 3 ปีเป็นระยะที่ใช้เทียบเท่านั้น' });
  }
  /* 2) กำลังรับ */
  if ((T === 'hire' || T === 'equip') && isVolModel(m) && pos(inp.capacity) && P.need !== null && P.need > 0) {
    var capA = pos(R.st.b.x.capacity), room = capA - n0(inp.volume);
    C.push({ id: 'room', label: (T === 'hire' && pos(d.capAdd) ? 'หลังจ้าง ' : T === 'equip' && pos(d.eqCap) ? 'หลังซื้อเครื่อง ' : '') + 'ร้านรับเพิ่มได้อีก', value: Math.max(0, room), unit: u,
      status: room >= P.need - 1e-6 ? 'ok' : 'short', sub: room >= P.need ? 'พอสำหรับยอดที่ต้อง' + gainWord(m) : 'ไม่พอสำหรับยอดที่ต้อง' + gainWord(m) + ' ' + fmtN(roundNeed(P.need, m)) + ' ' + u,
      lever: T === 'hire' ? 'capAdd' : 'eqCap' });
  }
  /* 2b) ยอดที่คาดเกินกำลังที่ร้านทำได้ (ย้ายร้าน ช่องทางใหม่ สาขา) */
  if ((T === 'place' || T === 'channel' || T === 'branch') && isVolModel(m) && pos(inp.capacity)) {
    var capV = pos(inp.capacity), want, capSet;
    if (T === 'branch') { want = n0(inp.volume) * n0(d.bPct) / 100; capSet = withD(d, 'bPct', capV / Math.max(1e-9, n0(inp.volume)) * 100); }
    else if (T === 'place') { want = P.have; capSet = P.set(d, capV); }
    else { var mvv = Math.min(100, n0(d.movePct)) / 100; want = n0(inp.volume) + n0(d.chQty) * (1 - mvv); capSet = mvv < 1 ? withD(d, 'chQty', Math.max(0, (capV - n0(inp.volume)) / (1 - mvv))) : d; }
    if (want > capV + 1e-9) {
      var over = R.profit - profitWith(capSet);
      C.push({ id: 'cap', label: (T === 'branch' ? 'สาขาทำได้สูงสุด ' : 'ร้านทำได้สูงสุด ') + fmtN(capV) + ' ' + u, value: null, txt: '', status: 'short', lever: P.key,
        sub: 'ยอดที่คาดคือ ' + fmtN(want, 1) + ' ' + u + ' เกินมา ' + fmtN(want - capV, 1) + (over > 0.5 ? ' · กำไรที่นับเกินกำลังราว ' + fmtN(over) + ' บาท/เดือน' : '') });
    }
  }
  /* 2c) เรื่องที่ทำให้ยอดของร้านเพิ่ม: ยอดที่คาดเกินกำลังที่ร้านทำได้ (หลังเพิ่มคนหรือเครื่องแล้ว) */
  var xs = R.st.b.x;
  if (['hire', 'equip', 'ads', 'freelance', 'promo', 'freeship', 'supplier'].indexOf(T) >= 0 && isVolModel(m) && pos(xs.capacity) && n0(xs.volume) > pos(xs.capacity) + 1e-9) {
    var cx = pos(xs.capacity), wv = n0(xs.volume), vu = volUnitText(inp, m), mf = inp.volumePer === 'month' ? 1 : daysOf(inp);
    var lpu = n0(xs.price) * (1 - n0(xs.feePct) / 100) - n0(xs.unitCost), ov = (wv - cx) * mf * lpu;
    C.push({ id: 'cap', label: 'ร้านทำได้สูงสุด ' + fmtN(cx) + ' ' + vu, value: null, txt: '', status: 'short', lever: P.key,
      sub: 'ยอดที่คาด' + (T === 'promo' ? 'ช่วงโปร' : '') + 'คือ ' + fmtN(wv, 1) + ' ' + vu + ' เกินมา ' + fmtN(wv - cx, 1) + (ov > 0.5 ? ' · กำไรที่นับเกินกำลังราว ' + fmtN(ov) + ' บาท/เดือน' : '') });
  }
  /* 3) ค่าเช่าที่ใหม่สูงสุด */
  if (T === 'place') {
    var rmax = n0(d.newRent) + R.delta;
    C.push(rmax <= 0 ? { id: 'rent', label: 'ค่าเช่าที่ใหม่', value: null, txt: 'ต่อให้ไม่มีค่าเช่า กำไรก็ยังน้อยกว่าตอนนี้', status: 'short', lever: 'newRent' }
      : { id: 'rent', label: 'ค่าเช่าที่ใหม่ จ่ายได้ไม่เกิน', value: rmax, unit: 'บาท/เดือน', have: n0(d.newRent), lever: 'newRent',
        status: R.delta >= -0.5 ? 'ok' : 'short', sub: 'ถึงจะได้กำไรต่อเดือนเท่าตอนนี้ ถ้า' + salesWord(m) + 'ที่ใหม่เป็นอย่างที่ดูอยู่ · ใส่ไว้ ' + fmtN(n0(d.newRent)) + ' บาท' });
  }
  /* 4) ลูกค้าเดิมย้ายมาได้ไม่เกิน */
  if (T === 'channel' && n0(d.chQty) > 0) {
    var p100 = profitWith(withD(d, 'movePct', 100)), p0m = profitWith(withD(d, 'movePct', 0));
    if (p0m >= base - 0.5) {
      var mx = p100 >= base - 0.5 ? 100 : solveFor(function (x) { return profitWith(withD(d, 'movePct', x)); }, base, 0, 50, 0, 100);
      if (mx !== null) C.push({ id: 'move', label: 'ลูกค้าเดิมย้ายมาได้ไม่เกิน', value: Math.floor(mx + 1e-9), unit: '%', have: n0(d.movePct), lever: 'movePct',
        status: n0(d.movePct) <= mx + 1e-6 ? 'ok' : 'short', sub: mx >= 100 ? 'ต่อให้ลูกค้าเดิมย้ายมาทั้งหมด ก็ยังได้กำไรไม่น้อยกว่าตอนนี้' : 'ของคนที่ซื้อผ่านช่องทางนี้ ถ้าเกินกว่านี้ กำไรจะน้อยกว่าตอนนี้ · ใส่ไว้ ' + fmtN(n0(d.movePct)) + '%' });
    }
  }
  /* 5) คืนทุน */
  if (R.one > 0 && T !== 'promo') {
    var life = T === 'equip' && pos(d.life) ? pos(d.life) * 12 : null;
    C.push({ id: 'pay', label: { place: 'เงินค่าย้ายคืนทุน', equip: 'ค่าเครื่องคืนทุน', branch: 'เงินลงทุนสาขาคืนทุน', newprod: 'เงินก้อนของของใหม่คืนทุน', ads: 'ค่าทำโฆษณาคืนทุน', supplier: 'ค่าเปลี่ยนเจ้าคืนทุน' }[T],
      value: R.payback, unit: 'เดือน', payback: true,
      lever: { place: 'moveCost', equip: 'price', branch: 'setup', newprod: 'npSetup', ads: 'adSetup', supplier: 'switchCost' }[T],
      status: R.payback === null || R.payback > 120 ? 'short' : life ? (R.payback <= life ? 'ok' : 'short') : 'info',
      sub: R.payback === null ? 'ตัวเลขแบบนี้ เงินที่ได้เพิ่มแต่ละเดือนยังไม่พอคืนเงินก้อน ' + fmtN(R.one) + ' บาท'
        : life ? 'เครื่องใช้ได้ ' + fmtN(life) + ' เดือน · ' + (R.payback > 120 ? 'คืนทุนนานกว่า 10 ปี' : R.payback <= life ? 'คืนทุนก่อนหมดอายุ' : 'หมดอายุก่อนคืนทุน') : 'นับจากเงินที่ได้เพิ่มจริงในแต่ละเดือน เทียบกับไม่ทำ' });
  }
  /* 5b) จัดโปร: กำไรรวมทั้งปี (ช่วงโปร + หลังจบโปร) */
  if (T === 'promo') C.push({ id: 'total', label: 'รวม 12 เดือน กำไรเทียบกับไม่ทำ', value: R.total12, unit: 'บาท', cash: true, lever: 'promoMonths',
    status: R.total12 >= -0.5 ? 'ok' : 'short', sub: 'ช่วงโปร ' + fmtN(promoDur(d)) + ' เดือน และหลังจบโปร' + (R.one > 0 ? ' · หักค่าจัดโปร ' + fmtN(R.one) + ' บาทแล้ว' : '') });
  /* 5b2) จัดโปร: ทั้งปีคุ้มหรือไม่ขึ้นกับยอดหลังจบโปร */
  if (T === 'promo' && promoDur(d) < 12) {
    var tAt = function (a) { var Ra = dEval(inp, m, T, withD(d, 'afterPct', a)); return Ra.ok ? Ra.total12 : NaN; };
    var t0 = tAt(0);
    if (t0 >= -0.5) C.push({ id: 'after', label: 'ต่อให้หลังจบโปร ยอดกลับมาเท่าเดิม', value: null, txt: 'ทั้งปียังได้กำไรไม่น้อยกว่าไม่ทำ', status: 'ok', lever: 'afterPct' });
    else {
      var an = solveFor(tAt, 0, 0, 10, 0, 500);
      if (an === null) C.push({ id: 'after', label: 'ถ้าจะให้ทั้งปีคุ้ม', value: null, txt: 'หลังจบโปรยอดต้องเพิ่มมากเกินจริง', status: 'short', lever: 'afterPct' });
      else {
        var apd = Math.pow(10, Math.max(1, decOf(n0(d.afterPct)))), as = Math.ceil(an * apd - 1e-9) / apd, ah = Math.floor(n0(d.afterPct) * apd + 1e-6) / apd;
        C.push({ id: 'after', label: 'ถ้าจะให้ทั้งปีคุ้ม หลังจบโปร' + salesWord(m) + 'ต้องสูงกว่าเดิมอย่างน้อย', value: as, unit: '%', have: n0(d.afterPct), haveShown: ah, lever: 'afterPct',
          status: ah >= as - 1e-9 ? 'ok' : 'short', sub: 'ถ้ายอดกลับมาเท่าเดิม ทั้งปีกำไรลด ' + fmtN(-t0) + ' บาท' });
      }
    }
  }
  /* 5c) ยิงโฆษณา: ค่าโฆษณาต่อหน่วยที่ขายเพิ่ม เทียบกับเงินที่เหลือต่อหน่วย */
  if (T === 'ads' && isVolModel(m) && n0(d.adGain) > 0) {
    var gm = inp.volumePer === 'month' ? n0(d.adGain) : n0(d.adGain) * daysOf(inp), left = n0(inp.price) * (1 - n0(inp.feePct) / 100) - n0(inp.unitCost);
    C.push({ id: 'cpa', label: 'ค่าโฆษณาต่อ' + U(inp, m) + 'ที่ขายเพิ่ม', value: (n0(d.adBudget) + n0(d.adMgmt)) / gm, unit: 'บาท', status: 'info', lever: 'adBudget',
      sub: 'แต่ละ' + U(inp, m) + 'เหลือเงิน ' + fmtN(left, 1) + ' บาท (ราคา − ต้นทุน − ค่าธรรมเนียม)' });
  }
  /* 6) เงินในมือ */
  if (R.need > 0.5) C.push({ id: 'cash', label: R.B.hasCash ? 'เงินจะขาดมือมากสุด' : 'ช่วงแรกต้องมีเงินอย่างน้อย', value: R.need, unit: 'บาท', status: 'short', cash: true, lever: null,
    sub: R.B.hasCash ? cashWhen(R) + ' · มีอยู่ ' + fmtN(R.cashStart) + ' บาท' : 'ยังไม่ได้ใส่เงินสดที่มี นี่คือเงินที่ต้องใช้ช่วงที่เงินออกมากกว่าเงินเข้า' });
  else if (R.B.hasCash) C.push({ id: 'cash', label: 'เงินในมือไม่ติดลบ ต่ำสุด', value: R.low, unit: 'บาท', status: 'ok', cash: true, lever: null,
    sub: R.lowT ? 'ในเดือน ' + monthLabel(R.lowT, true) : R.one > 0 ? 'ตอนจ่ายเงินก้อน' : 'เงินในมือไม่ลดลงจากตอนนี้' });
  /* 7) จ่ายเพื่อได้เวลาคืน */
  var payM = T === 'hire' ? R.st.b.fx.filter(function (a) { return a[0] === 'newstaff'; }).reduce(function (a, x) { return a + x[2]; }, 0) : T === 'freelance' ? n0(d.flFee) : 0;
  if ((T === 'hire' || (T === 'freelance' && !isKind(d, 'live'))) && n0(d.hours) > 0 && payM > 0) {
    var days = T === 'hire' && isKind(d, 'part') && pos(d.partDays) ? pos(d.partDays) : daysOf(inp);
    C.push({ id: 'hour', label: 'จ่ายเพื่อได้เวลาของคุณคืน ชั่วโมงละ', value: payM / (n0(d.hours) * days), unit: 'บาท', status: 'info', lever: 'hours',
      sub: (T === 'hire' ? 'ค่าจ้างคนใหม่' : 'ค่าจ้างฟรีแลนซ์') + ' ÷ (' + fmtN(n0(d.hours)) + ' ชั่วโมง × ' + fmtN(days) + ' วัน)' });
  }
  return C;
}

/* เงินขาดมือตั้งแต่เมื่อไร และมากสุดเมื่อไร */
function cashWhen(R) {
  var start = R.negT === 0 ? 'ขาดตั้งแต่วันจ่ายเงินก้อน' : R.negT ? 'เริ่มขาดเดือน ' + monthLabel(R.negT, true) : '';
  var peak = R.lowT ? 'มากสุดเดือน ' + monthLabel(R.lowT, true) : '';
  return [start, R.negT !== R.lowT ? peak : ''].filter(Boolean).join(' · ');
}

/* ---------- ถ้าไม่เป็นอย่างที่คาด (ใช้กับปุ่มบนแถบลาก) ---------- */
function dScenarios(inp, m, T, d, P) {
  P = P || dPivot(inp, m, T, d);
  var seen = {};
  return P.scen.map(function (s) {
    if (s[2] !== 'abs' && !(P.have > 0)) return null;
    var v = s[2] === 'abs' ? s[0] : P.have * s[0];
    if (seen[v.toFixed(6)]) return null;
    seen[v.toFixed(6)] = 1;
    var R = dEval(inp, m, T, P.set(d, v));
    return R.ok ? { f: s[0], label: s[1], v: v, profit: R.profit, delta: R.delta, low: R.low, need: R.need, payback: R.payback, one: R.one } : null;
  }).filter(Boolean);
}

/* ---------- คำอธิบายการตัดสินใจแบบสั้น ---------- */
function dSummary(T, d, inp, m) {
  var c = fmtN(Math.max(1, Math.round(n0(d.count))));
  if (T === 'hire') return isKind(d, 'part') ? 'จ้างพาร์ตไทม์ ' + c + ' คน' : isKind(d, 'piece') ? 'จ้างคนจ่ายรายชิ้น ' + U(inp, m) + 'ละ ' + fmtN(n0(d.pieceRate), 2) + ' บาท' : 'จ้างพนักงานประจำเพิ่ม ' + c + ' คน';
  if (T === 'price') return 'ขึ้นราคา' + priceWord(inp, m) + 'ละ ' + fmtN(n0(d.raiseBy), 2) + ' บาท' + (isKind(d, 'some') ? ' เฉพาะของที่ขายได้ ' + fmtN(n0(d.raiseShare)) + '%' : '');
  if (T === 'promo') return (isKind(d, 'gift') ? 'แถมของ' : isKind(d, 'code') ? 'แจกโค้ดลด ' + fmtN(n0(d.discPct)) + '%' : 'ลดราคา ' + fmtN(n0(d.discPct)) + '%') + ' นาน ' + fmtN(promoDur(d)) + ' เดือน';
  if (T === 'newprod') return (isKind(d, 'addon') ? 'เพิ่มของขายพ่วง' : 'เพิ่มของใหม่') + ' ราคา ' + fmtN(n0(d.npPrice), 2) + ' บาท';
  if (T === 'freeship') return isKind(d, 'part') ? 'ช่วยค่าส่งออร์เดอร์ละ ' + fmtN(n0(d.shipCost)) + ' บาท' : isKind(d, 'min') ? 'ส่งฟรีเมื่อซื้อถึงขั้นต่ำ' : 'ส่งฟรีทุกออร์เดอร์';
  if (T === 'ads') return 'ยิงโฆษณา' + (kindName(T, d, inp, m) ? ' ' + kindName(T, d, inp, m) : '') + ' เดือนละ ' + fmtN(n0(d.adBudget)) + ' บาท';
  if (T === 'supplier') return 'เปลี่ยนเจ้าใหม่ ต้นทุน' + U(inp, m) + 'ละ ' + fmtN(n0(d.newCost), 2) + ' บาท';
  if (T === 'freelance') return 'จ้าง' + (kindName(T, d, inp, m) || 'ฟรีแลนซ์') + ' เดือนละ ' + fmtN(n0(d.flFee)) + ' บาท';
  if (T === 'place') return 'ย้ายไปที่ใหม่ ค่าเช่า ' + fmtN(n0(d.newRent)) + ' บาท';
  if (T === 'channel') return tj('ขายผ่าน', d.chName || 'ช่องทางใหม่');
  if (T === 'equip') return 'ซื้ออุปกรณ์ ' + fmtN(n0(d.price)) + ' บาท';
  return 'เปิดสาขาที่ 2';
}
function fmtMonths(x) {
  if (x === null || x === undefined) return '–';
  if (x > 120) return 'เกิน 10\u00a0ปี';
  if (x < 1) return 'ไม่ถึง 1\u00a0เดือน';
  return fmtN(Math.ceil(x - 1e-9)) + '\u00a0เดือน';
}
/* ตัวเลขย่อ: ต่ำกว่า 1 แสนแสดงเต็ม · ปัดแล้วถึง 10 ให้ขึ้นหน่วยถัดไป (ไม่มี "10 หมื่น") */
function fmtCompact(n) {
  var a = Math.abs(n), s = n < -0.5 ? '−' : '';
  if (a < 1e5) return s + fmtN(a);
  var units = [[1e6, 'ล้าน'], [1e5, 'แสน']];
  for (var i = 0; i < units.length; i++) {
    var v = Math.round(a / units[i][0] * 10) / 10;
    if (a >= units[i][0] * 0.995) {
      if (units[i][1] === 'แสน' && v >= 10) return s + '1 ล้าน';
      return s + v.toLocaleString('th-TH') + ' ' + units[i][1];
    }
  }
  return s + fmtN(a);
}
