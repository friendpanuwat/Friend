/* ============================================================
   DECIDE — เทียบ "ไม่ทำ" กับ "ทำ" ของเรื่องใหญ่แต่ละเรื่อง
   ทุกตัวเลขต่อเดือนคำนวณด้วย JaruaCalc.calculateV4 (ตัวคำนวณของ PL2) ไม่มีสูตรกำไรของตัวเอง
   ส่วนที่คิดเพิ่มใน Lab: แปลงการตัดสินใจเป็นตัวเลขร้านชุดใหม่ · เงินก้อนที่จ่ายครั้งเดียว · ยอดที่ค่อยๆ ขึ้น
   · คืนทุน · เงื่อนไขที่ทำให้คุ้ม · ถ้าไม่เป็นอย่างที่คาด
   ============================================================ */

var DMEMO = new Map();
function runCalc(v4) {
  var key = JSON.stringify(v4);
  var r = DMEMO.get(key);
  if (r) return r;
  r = JaruaCalc.calculateV4(v4);
  if (DMEMO.size > 600) DMEMO.clear();
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
  return o;
}

function rampOf(T, d) { return T === 'place' ? 0 : Math.max(0, Math.round(n0(d.ramp))); }
/* ระดับของสิ่งที่คาดในเดือนที่ t: ค่อยๆ ขึ้นเท่ากันทุกเดือน จนเต็มในเดือนที่ k */
function levelAt(k, t) { return k > 0 ? Math.min(1, t / k) : 1; }
/* ย้ายร้าน: เดือนแรกลูกค้าขาดไป dip% แล้วค่อยๆ กลับมาครบในเดือนที่ back + 1 */
function placeProgress(d, t) {
  if (!(n0(d.dipPct) > 0)) return 1;
  var b = Math.max(1, Math.round(n0(d.backMonths) || 1));
  return Math.min(1, (t - 1) / b);
}

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
    fx.push(['newstaff', 'เงินเดือนพนักงานใหม่ ' + c + ' คน', c * n0(d.salary)]);
    x = addVol(x, m, n0(d.gain) * g);
    if (isVolModel(m) && pos(inp.capacity) && pos(d.capAdd)) x.capacity = pos(inp.capacity) + c * n0(d.capAdd);
  } else if (T === 'place') {
    var t = o.t || 0;
    var pf = Math.max(0, 1 + n0(d.salesPct) / 100) * f;
    if (t > 0) {
      pf *= 1 - Math.min(90, n0(d.dipPct)) / 100 * (1 - placeProgress(d, t));
      if (t === 1 && n0(d.closedDays) > 0) pf *= Math.max(0, 1 - n0(d.closedDays) / (isVolModel(m) ? daysOf(inp) : 30));
    }
    x = scaleVol(x, m, pf);
    x.rent = n0(d.newRent);
    one = n0(d.moveCost);
  } else if (T === 'channel') {
    var q = n0(d.chQty) * g;
    var mv = Math.min(100, n0(d.movePct)) / 100;
    x = addVol(x, m, -q * mv);
    if (m === 'rental') { var room = Math.max(0, 100 - n0(x.occupancy)); if (q > room) { note.clamped = true; q = room; } }
    if (q > 0) streams.push(channelStream(inp, m, d, q));
    note.chQ = q;
    fx.push(['chfee', 'ค่าใช้จ่ายรายเดือนของ' + (d.chName || 'ช่องทาง'), n0(d.chFee)]);
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
  } else if (T === 'branch') {
    var bp = n0(d.bPct) / 100 * g;
    if (bp > 0) streams.push(branchStream(inp, m, bp));
    fx.push(['brent', 'ค่าเช่าสาขา', n0(d.bRent)], ['bstaff', 'เงินเดือนพนักงานสาขา', n0(d.bStaff) * n0(d.bSalary)], ['bother', 'ค่าใช้จ่ายอื่นของสาขา', n0(d.bOther)]);
    one = n0(d.setup);
  }
  /* ขายเป็นหน่วยแล้วยอดเหลือ 0 (เช่น ปิดร้านทั้งเดือน) ตัวคำนวณถือว่า "ไม่ทราบยอด" จึงใส่ยอดที่ใกล้ 0 มากแทน ให้ได้รายได้ 0 จริง */
  if (isVolModel(m) && !(n0(x.volume) > 0)) x.volume = 1e-9;
  var v4 = v4Input(x, m);
  v4.streams = v4.streams.concat(streams);
  v4.fixedCostsMonthly = Math.max(0, v4.fixedCostsMonthly + fx.reduce(function (s, a) { return s + a[2]; }, 0));
  if (assets.length) v4.assets = (v4.assets || []).concat(assets);
  return { v4: v4, x: x, fx: fx, one: one, note: note };
}

function steady(inp, m, T, d, f) {
  var b = dBuild(inp, m, T, d, { lv: 1, f: f === undefined ? 1 : f });
  var r = runCalc(b.v4);
  return { b: b, r: r, profit: r.netProfitMonthly };
}

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

  /* 12 เดือน: เดือนที่ t ใช้ตัวเลขของเดือนนั้นจากตัวคำนวณ (รวมฤดูกาล การเติบโต และจังหวะเงินเข้าออกของร้าน) */
  var rows = [];
  for (var t = 1; t <= 12; t++) {
    var o = T === 'place' ? { t: t, f: f } : { lv: levelAt(k, t), f: f };
    var r = T === 'place' || o.lv !== 1 ? runCalc(dBuild(inp, m, T, d, o).v4) : st.r;
    var p = r.projection[t - 1];
    if (!p) return { ok: false };
    rows.push({ t: t, profit: p.netProfitAccounting, net: p.netCashFlow, rev: p.revenue,
      bProfit: B.cash[t - 1].profit, bNet: B.cash[t - 1].net, bBal: B.cash[t - 1].bal });
  }
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
  /* เงินที่ได้เพิ่มต่อเดือนเมื่อเข้าที่ (เดือนปกติ ไม่ใช่เดือนขายดีหรือขายแย่) = กำไรที่เปลี่ยน + เงินที่กันไว้ซื้อเครื่องใหม่ (ไม่ใช่เงินที่จ่ายออกจริง) */
  R.extraSteady = R.delta + (st.r.depreciation.monthlyTotal - B.r.depreciation.monthlyTotal);
  if (R.one > 0 && payback === null && R.extraSteady > 0.5) payback = 12 + (R.one - cum) / R.extraSteady;
  R.payback = R.one > 0 ? payback : null;
  R.noPayback = R.one > 0 && payback === null;
  R.ledger = dLedger(R, inp, m, T, d);
  R.warn = dWarn(R, inp, m, T, d);
  return R;
}

/* ---------- ใบเสร็จของการตัดสินใจ: กำไรต่อเดือนเปลี่ยนเพราะอะไรบ้าง (รวมกันได้เท่ากำไรที่เปลี่ยนพอดี) ---------- */
function dLedger(R, inp, m, T, d) {
  var r0 = R.B.r, r1 = R.st.r, b = R.st.b, L = [];
  var c0 = r0.revenueMonthly - r0.variableCostMonthly, c1 = r1.revenueMonthly - r1.variableCostMonthly;
  var extra = r1.streams.slice(1).map(function (s) { return s.contributionMonthly || 0; });
  var extraSum = extra.reduce(function (a, x) { return a + x; }, 0);
  var mainChg = c1 - c0 - extraSum;
  var mainLabel = {
    hire: 'เงินที่เหลือจาก' + salesWord(m) + 'ที่เพิ่ม', place: 'เงินที่เหลือจาก' + salesWord(m) + 'ที่ใหม่ เทียบกับตอนนี้',
    channel: 'ลูกค้าเดิมที่ย้ายไปซื้อผ่าน' + (d.chName || 'ช่องทางใหม่'), equip: salesWord(m) + 'ที่เพิ่ม และต้นทุนที่ลดลง', branch: ''
  }[T];
  if (Math.abs(mainChg) >= 0.5) L.push({ label: mainLabel, amount: mainChg });
  r1.streams.slice(1).forEach(function (s, i) {
    L.push({ label: s.id === 'ch' ? 'เงินที่เหลือจากขายผ่าน' + (d.chName || 'ช่องทางใหม่') : 'เงินที่เหลือจาก' + salesWord(m) + 'ของสาขา', amount: extra[i] });
  });
  var p0 = fixedParts(inp), p1 = fixedParts(b.x);
  if (Math.abs(p1.rent - p0.rent) >= 0.5) L.push({ label: 'ค่าเช่าที่ใหม่ เทียบกับที่เดิม', amount: -(p1.rent - p0.rent) });
  b.fx.forEach(function (a) { if (Math.abs(a[2]) >= 0.5) L.push({ label: a[1], amount: -a[2] }); });
  var dd = r1.depreciation.monthlyTotal - r0.depreciation.monthlyTotal;
  if (Math.abs(dd) >= 0.5) L.push({ label: 'กันไว้ซื้ออุปกรณ์ใหม่เมื่อเครื่องหมดอายุ', amount: -dd });
  /* เศษจากการปัดของตัวคำนวณ ใส่ไว้ในบรรทัดแรก เพื่อให้รวมกันได้เท่ากำไรที่เปลี่ยนพอดี */
  var sum = L.reduce(function (a, x) { return a + x.amount; }, 0);
  if (L.length && Math.abs(R.delta - sum) > 0.001) L[0].amount += R.delta - sum;
  return L;
}

function dWarn(R, inp, m, T, d) {
  var W = [], x = R.st.b.x;
  if (isVolModel(m) && pos(x.capacity)) {
    var mainV = n0(x.volume), chV = T === 'channel' ? n0(R.st.b.note.chQ) : 0;
    if (mainV + chV > pos(x.capacity) + 1e-9) W.push('ยอดที่คาดรวม ' + fmtN(mainV + chV, 1) + ' ' + volUnitText(inp, m) + ' เกินกำลังที่ร้านทำได้ (สูงสุด ' + fmtN(pos(x.capacity)) + ')');
  }
  if (m === 'subscription' && pos(inp.maxMembers) && T !== 'branch') {
    var tot = n0(x.members) + (T === 'channel' ? n0(R.st.b.note.chQ) : 0);
    if (tot > pos(inp.maxMembers)) W.push('สมาชิกที่คาดรวม ' + fmtN(tot) + ' คน เกินที่รับได้ (สูงสุด ' + fmtN(pos(inp.maxMembers)) + ' คน)');
  }
  if (T === 'channel' && R.st.b.note.clamped) W.push('คนเช่ารวมทุกช่องทางเต็ม 100% แล้ว ส่วนที่เกินไม่ได้นับ');
  if (T === 'channel') { var u = channelUnit(inp, m, d); if (u && u.ch <= 0) W.push('ขายผ่านช่องทางนี้ ' + (u.ch < 0 ? 'ยิ่งขายยิ่งขาดทุน' : 'ไม่เหลือเงินเลย') + ' เพราะส่วนแบ่งและต้นทุนเกินราคาขาย'); }
  if (T === 'equip' && R.payback !== null && pos(d.life) && R.payback > pos(d.life) * 12) W.push('คืนทุนช้ากว่าอายุใช้งานของเครื่อง (' + fmtN(pos(d.life)) + ' ปี)');
  return W;
}

/* ---------- หาค่าที่ทำให้กำไรต่อเดือนเท่าเดิม (กำไรเปลี่ยนเป็นเส้นตรงตามตัวเลขเกือบทุกกรณี จึงใช้วิธีเส้นตรงซ้ำแล้วยืนยันด้วยการคำนวณจริง) ---------- */
function solveFor(fn, target, x0, x1, lo, hi) {
  var f0 = fn(x0) - target, f1 = fn(x1) - target;
  for (var i = 0; i < 14; i++) {
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

function roundNeed(x, m) {
  if (x === null) return null;
  if (m === 'rental') return Math.ceil(x - 1e-9);
  return x < 10 ? Math.ceil(x * 10 - 1e-9) / 10 : Math.ceil(x - 1e-9);
}

/* ---------- เงื่อนไขที่ทำให้คุ้ม ----------
   แต่ละแถว: label · value (ตัวเลขเงื่อนไข) · unit · have (ตัวเลขที่คุณคาด) · dir (min = ต้องได้อย่างน้อย · max = ต้องไม่เกิน)
   lever = ช่องที่ลองเปลี่ยนในหน้าทดลองได้ */
function dConds(R, inp, m, T, d) {
  var C = [], base = R.B.profit, u = gainUnit(inp, m);
  function profitWith(dd) { return steady(inp, m, T, dd).profit; }
  if (T === 'hire' || T === 'equip') {
    var gk = T === 'hire' ? 'gain' : 'eqGain';
    var p0 = profitWith(withD(d, gk, 0));
    var need;
    if (p0 >= base - 0.5) need = 0;
    else {
      var cur = n0(inp[ROLE[m].vol]), s1 = Math.max(1, cur * 0.1);
      need = solveFor(function (x) { return profitWith(withD(d, gk, x)); }, base, 0, s1, 0, Math.max(cur * 50, 1e6));
    }
    var row = { id: 'need', lever: gk, unit: u, dir: 'min', have: n0(d[gk]) > 0 ? n0(d[gk]) : null };
    if (need === null) Object.assign(row, { status: 'short', label: 'ต้อง' + gainWord(m) + 'เท่าไหร่ถึงจะคุ้ม', value: null, txt: m === 'other' ? 'รายได้ที่เพิ่มไม่ช่วยให้คุ้ม' : 'ขายเพิ่มเท่าไหร่ก็ไม่คุ้ม เพราะขายแล้วไม่เหลือเงิน' });
    else if (need === 0) Object.assign(row, { label: 'ต้อง' + gainWord(m) + 'เท่าไหร่ถึงจะคุ้ม', value: 0, txt: T === 'equip' ? 'ไม่ต้องขายเพิ่ม เงินที่ประหยัดได้คุ้มแล้ว' : 'ไม่ต้องขายเพิ่ม' });
    else Object.assign(row, { label: 'ต้อง' + gainWord(m) + 'อย่างน้อย', value: roundNeed(need, m),
      sub: T === 'hire' ? 'ถึงจะได้กำไรเท่าตอนนี้ หลังจ่ายเงินเดือนคนใหม่' : 'ถึงจะได้กำไรเท่าตอนนี้ หลังหักเงินที่กันไว้ซื้อเครื่องใหม่' });
    C.push(row);
    /* กำลังรับ */
    if (isVolModel(m) && pos(inp.capacity) && need !== null && need > 0) {
      var capA = pos(R.st.b.x.capacity), room = capA - n0(inp.volume);
      C.push({ id: 'room', label: (T === 'hire' && pos(d.capAdd) ? 'หลังจ้าง ' : T === 'equip' && pos(d.eqCap) ? 'หลังซื้อเครื่อง ' : '') + 'ร้านรับเพิ่มได้อีก', value: Math.max(0, room), unit: u, dir: 'info',
        sub: room >= need ? 'พอสำหรับยอดที่ต้องขายเพิ่ม' : 'ไม่พอสำหรับยอดที่ต้องขายเพิ่ม ' + fmtN(roundNeed(need, m)) + ' ' + u, status: room >= need ? 'ok' : 'short', lever: T === 'hire' ? 'capAdd' : 'eqCap' });
    }
    if (T === 'hire' && n0(d.hours) > 0) {
      var days = pos(inp.daysOpen) || 26;
      C.push({ id: 'hour', label: 'จ่ายเพื่อได้เวลาของคุณคืน ชั่วโมงละ', value: n0(d.count) * n0(d.salary) / (n0(d.hours) * days), unit: 'บาท', dir: 'info',
        sub: 'คิดจากเงินเดือนคนใหม่ ÷ ' + fmtN(n0(d.hours)) + ' ชั่วโมง × ' + fmtN(days) + ' วัน', lever: 'hours' });
    }
    if (T === 'equip') {
      C.push({ id: 'pay', label: 'คืนทุน', value: R.payback, unit: 'เดือน', dir: 'max', have: null, payback: true,
        sub: R.payback === null ? 'ตัวเลขแบบนี้ เงินที่ได้เพิ่มยังไม่พอคืนค่าเครื่อง' : pos(d.life) ? 'เครื่องใช้ได้ ' + fmtN(pos(d.life)) + ' ปี (' + fmtN(pos(d.life) * 12) + ' เดือน)' : '',
        status: R.payback === null ? 'short' : pos(d.life) ? (R.payback <= pos(d.life) * 12 ? 'ok' : 'short') : null, lever: 'price' });
    }
  } else if (T === 'place') {
    var cur2 = n0(inp[ROLE[m].vol]);
    var needPct = solveFor(function (x) { return profitWith(withD(d, 'salesPct', x)); }, base, 0, 10, -100, 2000);
    var r1 = { id: 'need', lever: 'salesPct', dir: 'min', unit: u, have: cur2 * (1 + n0(d.salesPct) / 100) };
    if (needPct === null) Object.assign(r1, { status: 'short', label: salesWord(m) + 'ที่ใหม่ต้องเป็นเท่าไหร่', value: null, txt: 'ยอดเท่าไหร่ก็ไม่คุ้ม' });
    else {
      var nv = cur2 * (1 + needPct / 100);
      Object.assign(r1, { label: 'ที่ใหม่ต้อง' + ({ rental: 'มีคนเช่า', subscription: 'มีสมาชิก', project: 'ได้งาน', commission: 'ปิดดีลได้', other: 'ได้เงิน' }[m] || (m === 'service' ? 'มีลูกค้า' : 'ขายได้')) + 'อย่างน้อย',
        value: roundNeed(nv, m), sub: 'ถึงจะได้กำไรเท่าตอนนี้ (' + (needPct >= 0 ? 'มากกว่า' : 'น้อยกว่า') + 'ตอนนี้ ' + fmtPct(Math.abs(needPct)) + ')' });
    }
    C.push(r1);
    C.push({ id: 'rent', label: 'ค่าเช่าที่ใหม่ จ่ายได้ไม่เกิน', value: Math.max(0, n0(d.newRent) + R.delta), unit: 'บาท/เดือน', dir: 'max', have: n0(d.newRent), lever: 'newRent',
      sub: 'ถ้า' + salesWord(m) + 'เป็นไปตามที่คาด กำไรจะเท่าตอนนี้' });
    if (R.one > 0) C.push({ id: 'pay', label: 'เงินค่าย้ายคืนทุน', value: R.payback, unit: 'เดือน', dir: 'info', payback: true, lever: 'moveCost',
      sub: R.payback === null ? 'ตัวเลขแบบนี้ ที่ใหม่ได้เงินไม่มากกว่าที่เดิม เงินค่าย้ายจึงไม่คืนกลับมา' : 'นับจากเงินที่ได้เพิ่มจริงในแต่ละเดือน', status: R.payback === null ? 'short' : null });
  } else if (T === 'channel') {
    var cu = channelUnit(inp, m, d);
    var unitWord = { subscription: 'สมาชิก 1 คนต่อเดือน', project: 'งาน', rental: periodWord(inp) + 'ที่มีคนเช่า', commission: 'ดีล' }[m] || U(inp, m);
    if (cu) C.push({ id: 'unit', label: 'ขายผ่าน' + (d.chName || 'ช่องทางนี้') + ' เหลือเงินต่อ' + unitWord, value: cu.ch, unit: 'บาท', dir: 'info',
      sub: 'ขายเองเหลือ ' + fmtN(cu.own, 1) + ' บาท' + (cu.own > 0 && cu.ch < cu.own ? ' · น้อยกว่า ' + fmtPct((1 - cu.ch / cu.own) * 100) : ''), status: cu.ch <= 0 ? 'short' : null, lever: 'cut' });
    var needQ = solveFor(function (x) { return profitWith(withD(d, 'chQty', x)); }, base, 0, Math.max(1, n0(d.chQty) || 10), 0, 1e7);
    var p00 = profitWith(withD(d, 'chQty', 0));
    if (p00 >= base - 0.5) needQ = 0;
    C.push(needQ === null ? { id: 'need', label: 'ต้องขายผ่านช่องทางนี้เท่าไหร่ถึงจะคุ้ม', value: null, txt: 'ขายเท่าไหร่ก็ไม่คุ้ม', lever: 'chQty', status: 'short' }
      : { id: 'need', label: 'ต้องขายผ่านช่องทางนี้อย่างน้อย', value: roundNeed(needQ, m), unit: m === 'rental' ? '% ของทั้งหมด' : u, dir: 'min', have: n0(d.chQty) > 0 ? n0(d.chQty) : null, lever: 'chQty',
        sub: 'ถึงจะได้กำไรเท่าตอนนี้ หลังหักค่าใช้จ่ายของช่องทาง' + (n0(d.movePct) > 0 ? ' และลูกค้าเดิมที่ย้ายมา' : '') });
    if (m !== 'commission' && cu) {
      var pk = ROLE[m].price, curP = n0(inp[pk]);
      var eqP = solveFor(function (x) { var u2 = channelUnit(inp, m, withD(d, 'chPrice', x)); return u2 ? u2.ch : 0; }, cu.own, curP, curP * 1.2 + 1, 0, curP * 50 + 1e5);
      if (eqP !== null) C.push({ id: 'price', label: 'ราคาบนช่องทางที่เหลือเงินเท่าขายเอง', value: Math.ceil(eqP - 1e-9), unit: 'บาท', dir: 'min', have: pos(d.chPrice) || curP, lever: 'chPrice',
        sub: 'ตอนนี้ขายเอง ' + fmtN(curP) + ' บาท' });
    }
    if (n0(d.chQty) > 0) {
      var p100 = profitWith(withD(d, 'movePct', 100)), p0m = profitWith(withD(d, 'movePct', 0));
      if (p0m < base - 0.5) { /* ลูกค้าใหม่ทั้งหมดก็ยังไม่คุ้ม — แถวนี้ไม่มีความหมาย */ }
      else if (p100 >= base - 0.5) C.push({ id: 'move', label: 'ลูกค้าเดิมย้ายมาได้ไม่เกิน', value: 100, unit: '%', dir: 'max', have: n0(d.movePct), lever: 'movePct', sub: 'ต่อให้ลูกค้าเดิมย้ายมาทั้งหมด ก็ยังได้กำไรไม่น้อยกว่าตอนนี้' });
      else {
        var mx = solveFor(function (x) { return profitWith(withD(d, 'movePct', x)); }, base, 0, 50, 0, 100);
        if (mx !== null) C.push({ id: 'move', label: 'ลูกค้าเดิมย้ายมาได้ไม่เกิน', value: Math.floor(mx), unit: '%', dir: 'max', have: n0(d.movePct), lever: 'movePct',
          sub: 'ของคนที่ซื้อผ่านช่องทางนี้ ถ้าเกินกว่านี้ กำไรจะน้อยกว่าตอนนี้' });
      }
    }
  } else if (T === 'branch') {
    var nb = solveFor(function (x) { return profitWith(withD(d, 'bPct', x)); }, base, 0, 50, 0, 1000);
    var cur3 = n0(inp[ROLE[m].vol]);
    C.push(nb === null ? { id: 'need', label: 'สาขาต้องขายได้เท่าไหร่', value: null, txt: 'ขายเท่าไหร่ก็ไม่คุ้ม', lever: 'bPct', status: 'short' }
      : { id: 'need', label: 'สาขาต้องมี' + salesWord(m) + 'อย่างน้อย', value: Math.ceil(nb - 1e-9), unit: '% ของร้านเดิม', dir: 'min', have: n0(d.bPct), lever: 'bPct',
        sub: (m === 'rental' ? '= มีคนเช่า ' + fmtN(roundNeed(cur3 * nb / 100, m)) + '% ของ' + U(inp, m) + 'ทั้งหมดที่สาขา' : '= ' + fmtN(roundNeed(cur3 * nb / 100, m)) + ' ' + u) + ' ถึงจะได้กำไรเท่าตอนนี้ (ไม่ขาดทุนจากสาขา)' });
    C.push({ id: 'pay', label: 'เงินลงทุนคืนทุน', value: R.payback, unit: 'เดือน', dir: 'info', payback: true, lever: 'setup',
      sub: R.payback === null ? 'ตัวเลขแบบนี้ สาขายังไม่ได้เงินเพิ่มพอคืนเงินลงทุน' : 'นับจากเงินที่สาขาได้เพิ่มจริงในแต่ละเดือน', status: R.payback === null ? 'short' : null });
  }
  /* เงินในมือ (ทุกเรื่อง) */
  if (R.need > 0.5) C.push({ id: 'cash', label: R.B.hasCash ? 'ต้องหาเงินเพิ่มอย่างน้อย' : 'ต้องมีเงินเตรียมไว้อย่างน้อย', value: R.need, unit: 'บาท', dir: 'info', status: 'short', cash: true,
    sub: R.B.hasCash ? 'ไม่อย่างนั้นเงินจะขาดมือ' + (R.lowT ? 'ในเดือน ' + monthLabel(R.lowT, true) : 'ตั้งแต่ตอนจ่ายเงินก้อนแรก') : 'ยังไม่ได้ใส่เงินสดที่มี · นี่คือเงินที่ต้องใช้ช่วงที่เงินออกมากกว่าเงินเข้า' });
  C.forEach(function (c) {
    if (c.status !== undefined || c.dir === 'info' || c.value === null || c.have === null || c.have === undefined) return;
    c.status = c.dir === 'min' ? (c.have >= c.value - 1e-9 ? 'ok' : 'short') : (c.have <= c.value + 1e-9 ? 'ok' : 'short');
  });
  return C;
}

/* ---------- ถ้าไม่เป็นอย่างที่คาด ---------- */
var SCEN = {
  hire: [[1, 'ได้ตามที่คาด'], [0.5, 'ได้ครึ่งเดียว'], [0, 'ไม่ได้ขายเพิ่มเลย']],
  place: [[1, 'ได้ตามที่คาด'], [0.9, 'ต่ำกว่าที่คาด 10%'], [0.8, 'ต่ำกว่าที่คาด 20%']],
  channel: [[1, 'ได้ตามที่คาด'], [0.5, 'ได้ครึ่งเดียว'], [0, 'ไม่มีคนซื้อผ่านช่องทางนี้']],
  equip: [[1, 'ได้ผลตามที่คาด'], [0.5, 'ได้ผลครึ่งเดียว'], [0, 'ไม่ได้ผลเลย']],
  branch: [[1, 'ได้ตามที่คาด'], [0.8, 'ต่ำกว่าที่คาด 20%'], [0.5, 'ได้ครึ่งเดียว']]
};
function hasExpectation(T, d) {
  if (T === 'hire') return n0(d.gain) > 0;
  if (T === 'equip') return n0(d.eqGain) > 0 || n0(d.costDown) > 0 || n0(d.fixedChg) < 0;
  return true;
}
function dScenarios(inp, m, T, d) {
  if (!hasExpectation(T, d)) return [];
  return SCEN[T].map(function (s) {
    var R = dEval(inp, m, T, d, { f: s[0] });
    return R.ok ? { f: s[0], label: s[1], profit: R.profit, delta: R.delta, low: R.low, lowT: R.lowT, payback: R.payback, one: R.one } : null;
  }).filter(Boolean);
}

/* ---------- คำอธิบายการตัดสินใจแบบสั้น ---------- */
function dSummary(T, d, inp, m) {
  if (T === 'hire') return 'จ้างพนักงานเพิ่ม ' + fmtN(Math.max(1, Math.round(n0(d.count)))) + ' คน';
  if (T === 'place') return 'ย้ายไปที่ใหม่ ค่าเช่า ' + fmtN(n0(d.newRent)) + ' บาท';
  if (T === 'channel') return 'ขายผ่าน' + (d.chName || 'ช่องทางใหม่');
  if (T === 'equip') return 'ซื้ออุปกรณ์ ' + fmtN(n0(d.price)) + ' บาท';
  return 'เปิดสาขาที่ 2';
}
function fmtMonths(x) {
  if (x === null || x === undefined) return '–';
  if (x > 120) return 'เกิน 10 ปี';
  if (x < 1) return 'ไม่ถึง 1 เดือน';
  return fmtN(Math.ceil(x - 1e-9)) + ' เดือน';
}
