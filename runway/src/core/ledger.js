/* RUNWAY — double-entry ledger, statements, Thai tax rules, loans, depreciation */
(function (RW) {
  'use strict';
  var U = RW.U;

  // Debit-positive convention: assets & expenses carry positive balances,
  // liabilities, equity and revenue carry negative balances.
  var A = (RW.ACCOUNTS = {
    // Assets
    cash: { t: 'A', n: 'เงินสดและเงินฝากธนาคาร' },
    ar: { t: 'A', n: 'ลูกหนี้การค้า' },
    inventory: { t: 'A', n: 'สินค้าคงเหลือ' },
    prepaid: { t: 'A', n: 'เงินมัดจำและค่าใช้จ่ายล่วงหน้า' },
    whtc: { t: 'A', n: 'ภาษีถูกหัก ณ ที่จ่าย (เครดิตภาษี)' },
    ppe: { t: 'A', n: 'อุปกรณ์และส่วนปรับปรุงอาคาร' },
    accdep: { t: 'A', n: 'หัก ค่าเสื่อมราคาสะสม' },
    // Liabilities
    ap: { t: 'L', n: 'เจ้าหนี้การค้า' },
    accrued: { t: 'L', n: 'ค่าใช้จ่ายค้างจ่าย' },
    deferred: { t: 'L', n: 'รายได้รับล่วงหน้า' },
    loans: { t: 'L', n: 'เงินกู้ยืม' },
    safe: { t: 'L', n: 'SAFE / หุ้นกู้แปลงสภาพ' },
    taxpay: { t: 'L', n: 'ภาษีเงินได้ค้างจ่าย' },
    // Equity
    capital: { t: 'E', n: 'ทุนเรือนหุ้นและส่วนเกินมูลค่าหุ้น' },
    retained: { t: 'E', n: 'กำไร (ขาดทุน) สะสมยกมา' },
    // Revenue
    rev_sub: { t: 'R', n: 'รายได้ค่าบริการรายเดือน/รายปี', g: 'rev' },
    rev_svc: { t: 'R', n: 'รายได้งานบริการ/ติดตั้ง', g: 'rev' },
    rev_goods: { t: 'R', n: 'รายได้จากการขายสินค้า', g: 'rev' },
    rev_food: { t: 'R', n: 'รายได้หน้าร้าน', g: 'rev' },
    rev_deliv: { t: 'R', n: 'รายได้ผ่านแอปเดลิเวอรี', g: 'rev' },
    rev_franchise: { t: 'R', n: 'ค่าแฟรนไชส์และรอยัลตี้', g: 'rev' },
    rev_other: { t: 'R', n: 'รายได้อื่น', g: 'rev' },
    rev_consult: { t: 'R', n: 'รายได้งานรับจ้าง/ที่ปรึกษา (ผู้ก่อตั้ง)', g: 'rev' },
    contra_rev: { t: 'R', n: 'หัก ส่วนลด/คืนสินค้า', g: 'rev' },
    // COGS
    cogs_host: { t: 'X', n: 'ค่าเซิร์ฟเวอร์และคลาวด์', g: 'cogs' },
    cogs_staff: { t: 'X', n: 'เงินเดือนพนักงานฝ่ายบริการ/ปฏิบัติการ', g: 'cogs' },
    cogs_fees: { t: 'X', n: 'ค่าธรรมเนียมรับชำระเงิน', g: 'cogs' },
    cogs_goods: { t: 'X', n: 'ต้นทุนสินค้า/วัตถุดิบ', g: 'cogs' },
    cogs_fulfil: { t: 'X', n: 'ค่าแพ็ก ขนส่ง และคลังสินค้า', g: 'cogs' },
    cogs_platform: { t: 'X', n: 'ค่าคอมมิชชันแพลตฟอร์ม (GP)', g: 'cogs' },
    cogs_waste: { t: 'X', n: 'ของเสีย/สินค้าหมดอายุ/ตัดจำหน่าย', g: 'cogs' },
    cogs_other: { t: 'X', n: 'ต้นทุนบริการอื่น', g: 'cogs' },
    // Operating expenses
    sal_rnd: { t: 'X', n: 'เงินเดือน — วิจัยและพัฒนา', g: 'rnd' },
    sal_sm: { t: 'X', n: 'เงินเดือน — ขายและการตลาด', g: 'sm' },
    sal_ga: { t: 'X', n: 'เงินเดือน — บริหารและธุรการ', g: 'ga' },
    benefits: { t: 'X', n: 'ประกันสังคม สวัสดิการ โบนัส', g: 'ga' },
    mkt: { t: 'X', n: 'ค่าการตลาดและโฆษณา', g: 'sm' },
    commission: { t: 'X', n: 'ค่าคอมมิชชันพนักงานขาย/พาร์ทเนอร์', g: 'sm' },
    rent: { t: 'X', n: 'ค่าเช่าสถานที่', g: 'ga' },
    utilities: { t: 'X', n: 'ค่าน้ำ ค่าไฟ ค่าส่วนกลาง', g: 'ga' },
    software: { t: 'X', n: 'ซอฟต์แวร์และเครื่องมือ', g: 'ga' },
    prof: { t: 'X', n: 'ค่าที่ปรึกษา กฎหมาย บัญชี ตรวจสอบ', g: 'ga' },
    recruit: { t: 'X', n: 'ค่าสรรหาบุคลากร', g: 'ga' },
    travel: { t: 'X', n: 'ค่าเดินทางและรับรอง', g: 'sm' },
    office: { t: 'X', n: 'ค่าใช้จ่ายสำนักงาน', g: 'ga' },
    insurance: { t: 'X', n: 'ค่าเบี้ยประกันภัยธุรกิจ', g: 'ga' },
    culture: { t: 'X', n: 'กิจกรรมพนักงานและการฝึกอบรม', g: 'ga' },
    severance: { t: 'X', n: 'ค่าชดเชยเลิกจ้าง', g: 'ga' },
    baddebt: { t: 'X', n: 'หนี้สูญ', g: 'ga' },
    penalties: { t: 'X', n: 'ค่าปรับและค่าเสียหาย', g: 'ga' },
    depr: { t: 'X', n: 'ค่าเสื่อมราคา', g: 'ga' },
    other_exp: { t: 'X', n: 'ค่าใช้จ่ายอื่น', g: 'ga' },
    // Non-operating
    int_income: { t: 'R', n: 'ดอกเบี้ยรับ', g: 'nonop' },
    other_income: { t: 'R', n: 'รายได้อื่น (ทุนให้เปล่า เงินชดเชย)', g: 'nonop' },
    interest: { t: 'X', n: 'ดอกเบี้ยจ่าย', g: 'nonop' },
    gainloss: { t: 'X', n: 'กำไร/ขาดทุนพิเศษ', g: 'nonop' },
    tax_exp: { t: 'X', n: 'ภาษีเงินได้นิติบุคคล', g: 'tax' }
  });

  var L = (RW.Ledger = {});

  L.init = function () {
    var bal = {};
    Object.keys(A).forEach(function (k) { bal[k] = 0; });
    return {
      bal: bal,
      month: L.blankMonth(),
      ytd: {},              // P&L accumulator for fiscal year (tax)
      history: [],          // closed months
      loans: [],
      assets: [],           // depreciable assets
      ar: [],               // open invoices {id, amt, due, wht, seg, name}
      taxLoss: [],          // [{year, amt}] loss carry-forward
      taxDue: null,         // {amt, dueWeek}
      vat: { registered: false, required: false, warnedWeek: -1 },
      creditLine: 0,        // overdraft limit
      unpaid: { payroll: 0, weeksNeg: 0 }
    };
  };

  L.blankMonth = function () {
    return { pl: {}, cf: { op: 0, inv: 0, fin: 0 }, notes: [] };
  };

  // Post a balanced transaction. lines: {acct: amount (debit +, credit -)}
  L.post = function (fin, lines, cf) {
    var sum = 0, k;
    for (k in lines) {
      if (!A[k]) throw new Error('Unknown account ' + k);
      if (!isFinite(lines[k])) throw new Error('Non-finite amount on ' + k);
      sum += lines[k];
    }
    if (Math.abs(sum) > 0.01) throw new Error('Unbalanced tx ' + JSON.stringify(lines));
    for (k in lines) {
      var v = lines[k];
      if (!v) continue;
      fin.bal[k] += v;
      var t = A[k].t;
      if (t === 'R' || t === 'X') {
        fin.month.pl[k] = (fin.month.pl[k] || 0) + v;
        fin.ytd[k] = (fin.ytd[k] || 0) + v;
      }
      if (k === 'cash') {
        fin.month.cf[cf || 'op'] += v;
        if (fin.week) fin.week[cf || 'op'] += v;
      }
    }
  };

  // Common shortcuts
  L.spend = function (fin, acct, amt, cf) { if (amt) { var l = {}; l[acct] = amt; l.cash = -amt; L.post(fin, l, cf || 'op'); } };
  L.earnCash = function (fin, acct, amt) { if (amt) { var l = {}; l[acct] = -amt; l.cash = amt; L.post(fin, l, 'op'); } };

  // Invoice on credit terms (B2B). WHT 3% withheld by corporate customers in Thailand.
  L.invoice = function (state, acct, amt, dueWeek, opts) {
    var fin = state.fin;
    if (!amt) return;
    var l = {}; l[acct] = -amt; l.ar = amt;
    L.post(fin, l);
    fin.ar.push({ id: RW.R.id('inv'), amt: amt, due: dueWeek, wht: !!(opts && opts.wht), name: (opts && opts.name) || '', seg: (opts && opts.seg) || '', late: 0, sure: !!(opts && opts.sure) });
  };

  // Book revenue that is billed in advance (annual contracts): cash in, deferred liability
  L.billAdvance = function (fin, amt, viaAR, state, dueWeek, opts) {
    if (!amt) return;
    if (viaAR) {
      L.post(fin, { ar: amt, deferred: -amt });
      fin.ar.push({ id: RW.R.id('inv'), amt: amt, due: dueWeek, wht: !!(opts && opts.wht), name: (opts && opts.name) || '', seg: (opts && opts.seg) || '', late: 0 });
    } else {
      L.post(fin, { cash: amt, deferred: -amt }, 'op');
    }
  };
  L.recognizeDeferred = function (fin, acct, amt) {
    if (!amt) return;
    var l = { deferred: amt }; l[acct] = -amt;
    L.post(fin, l);
  };

  // Weekly collection of receivables
  L.collectAR = function (state) {
    var fin = state.fin, w = state.time.w, keep = [];
    var macroDelay = state.world ? state.world.macro.payDelay : 0;
    var collected = 0, badDebt = 0;
    for (var i = 0; i < fin.ar.length; i++) {
      var inv = fin.ar[i];
      if (inv.due <= w) {
        // probability to pay on time decreases in bad economy
        // platforms (marketplaces, delivery apps) settle on schedule; companies pay late
        var pPay = inv.sure ? 0.99 : U.clamp(0.82 - macroDelay * 0.25 - inv.late * 0.04, 0.25, 0.97);
        if (RW.R.chance(pPay)) {
          var whtAmt = inv.wht ? inv.amt * 0.03 : 0;
          L.post(fin, { cash: inv.amt - whtAmt, whtc: whtAmt, ar: -inv.amt }, 'op');
          collected += inv.amt;
        } else {
          inv.late++;
          if (inv.late > 16 && RW.R.chance(0.15)) {
            L.post(fin, { baddebt: inv.amt, ar: -inv.amt });
            badDebt += inv.amt;
          } else keep.push(inv);
        }
      } else keep.push(inv);
    }
    fin.ar = keep;
    return { collected: collected, badDebt: badDebt };
  };

  L.arOverdue = function (state) {
    var w = state.time.w;
    return U.sum(state.fin.ar.filter(function (i) { return i.due < w; }), function (i) { return i.amt; });
  };

  // ---------- Fixed assets ----------
  L.buyAsset = function (state, name, cost, lifeMonths, viaLoan) {
    var fin = state.fin;
    L.post(fin, { ppe: cost, cash: -cost }, 'inv');
    fin.assets.push({ id: RW.R.id('fa'), name: name, cost: cost, life: lifeMonths, left: lifeMonths, perMonth: cost / lifeMonths });
  };
  L.depreciate = function (state) {
    var fin = state.fin, total = 0;
    fin.assets.forEach(function (a) {
      if (a.left > 0) { total += a.perMonth; a.left--; }
    });
    if (total > 0) L.post(fin, { depr: total, accdep: -total });
    // retire fully-depreciated assets from the register
    var keep = [];
    fin.assets.forEach(function (a) {
      if (a.left <= 0) L.post(fin, { ppe: -a.cost, accdep: a.cost });
      else keep.push(a);
    });
    fin.assets = keep;
  };
  // write off remaining book value (e.g., closing a branch)
  L.writeOffAsset = function (state, assetId) {
    var fin = state.fin;
    var a = fin.assets.find(function (x) { return x.id === assetId; });
    if (!a) return 0;
    var used = a.cost - a.perMonth * a.left;
    var nbv = a.perMonth * a.left;
    L.post(fin, { ppe: -a.cost, accdep: used, gainloss: nbv });
    fin.assets = fin.assets.filter(function (x) { return x.id !== assetId; });
    return nbv;
  };

  // ---------- Loans ----------
  // kind: 'bank' | 'venture' | 'rbf' | 'founder' | 'emergency'
  L.addLoan = function (state, opt) {
    var fin = state.fin;
    var loan = {
      id: RW.R.id('ln'), kind: opt.kind, name: opt.name, principal: opt.amount, balance: opt.amount,
      rate: opt.rate, months: opt.months || 0, interestOnly: opt.interestOnly || 0,
      revShare: opt.revShare || 0, cap: opt.cap || 0, repaid: 0, startW: state.time.w, missed: 0
    };
    if (loan.kind !== 'rbf' && loan.months > 0) {
      var r = loan.rate / 12, n = loan.months - loan.interestOnly;
      loan.payment = r > 0 ? loan.principal * r / (1 - Math.pow(1 + r, -n)) : loan.principal / n;
    }
    // revenue-based financing: liability booked at principal; the fixed fee is expensed as interest when paid
    if (loan.kind === 'rbf') loan.feeLeft = opt.amount * (opt.cap - 1);
    L.post(fin, { cash: opt.amount, loans: -opt.amount }, 'fin');
    fin.loans.push(loan);
    return loan;
  };

  // Monthly debt service. revenueThisMonth used for revenue-based financing.
  L.serviceLoans = function (state, revenueThisMonth) {
    var fin = state.fin, keep = [];
    var paidTotal = 0;
    fin.loans.forEach(function (ln) {
      var age = Math.floor((state.time.w - ln.startW) / 4.33);
      if (ln.kind === 'rbf') {
        var pay = Math.max(0, revenueThisMonth * ln.revShare);
        var totalLeft = ln.balance + ln.feeLeft;
        pay = Math.min(pay, totalLeft);
        var feePart = pay * (ln.feeLeft / Math.max(1, totalLeft));
        var prinPart = pay - feePart;
        if (pay > 0) {
          L.post(fin, { loans: prinPart, interest: feePart, cash: -pay }, 'fin');
          ln.balance -= prinPart; ln.feeLeft -= feePart; ln.repaid += pay; paidTotal += pay;
        }
        if (ln.balance + ln.feeLeft > 1) keep.push(ln);
        return;
      }
      var interest = ln.balance * ln.rate / 12;
      var principal = 0;
      if (ln.kind === 'founder') {
        // shareholder loan: interest accrues, repaid at founder's discretion
        if (interest > 0) L.post(fin, { interest: interest, cash: -interest }, 'fin');
        keep.push(ln);
        return;
      }
      if (age >= ln.interestOnly) principal = Math.min(ln.balance, (ln.payment || 0) - interest);
      if (principal < 0) principal = 0;
      var amt = interest + principal;
      L.post(fin, { interest: interest, loans: principal, cash: -amt }, 'fin');
      ln.balance -= principal; ln.repaid += amt; paidTotal += amt;
      if (ln.balance > 1) keep.push(ln);
    });
    fin.loans = keep;
    return paidTotal;
  };

  L.repayLoan = function (state, loanId, amt) {
    var fin = state.fin;
    var ln = fin.loans.find(function (l) { return l.id === loanId; });
    if (!ln) return 0;
    var pay = Math.min(amt, ln.balance + (ln.feeLeft || 0));
    var fee = ln.feeLeft ? Math.min(ln.feeLeft, pay * ln.feeLeft / (ln.balance + ln.feeLeft)) : 0;
    L.post(fin, { loans: pay - fee, interest: fee, cash: -pay }, 'fin');
    ln.balance -= (pay - fee); if (ln.feeLeft) ln.feeLeft -= fee;
    if (ln.balance + (ln.feeLeft || 0) < 1) fin.loans = fin.loans.filter(function (l) { return l.id !== loanId; });
    return pay;
  };

  L.debt = function (state) { return -state.fin.bal.loans; };

  // ---------- Statements ----------
  L.sumGroup = function (pl, g) {
    var s = 0;
    for (var k in pl) if (A[k] && A[k].g === g) s += pl[k];
    return s;
  };
  // Build a P&L view from a {acct: debitPositive} map
  L.pnl = function (pl) {
    var rev = -L.sumGroup(pl, 'rev');
    var cogs = L.sumGroup(pl, 'cogs');
    var gp = rev - cogs;
    var rnd = L.sumGroup(pl, 'rnd'), sm = L.sumGroup(pl, 'sm'), ga = L.sumGroup(pl, 'ga');
    var opex = rnd + sm + ga;
    var ebitda = gp - opex + (pl.depr || 0);
    var ebit = gp - opex;
    var nonop = -L.sumGroup(pl, 'nonop');
    var ebt = ebit + nonop;
    var tax = L.sumGroup(pl, 'tax');
    return { rev: rev, cogs: cogs, gp: gp, gm: rev > 0 ? gp / rev : 0, rnd: rnd, sm: sm, ga: ga, opex: opex, ebitda: ebitda, ebit: ebit, nonop: nonop, ebt: ebt, tax: tax, ni: ebt - tax };
  };

  L.balanceSheet = function (fin) {
    var b = fin.bal;
    var assets = b.cash + b.ar + b.inventory + b.prepaid + b.whtc + b.ppe + b.accdep;
    var liab = -(b.ap + b.accrued + b.deferred + b.loans + b.safe + b.taxpay);
    var currentEarnings = 0;
    for (var k in b) if (A[k].t === 'R' || A[k].t === 'X') currentEarnings -= b[k];
    var equity = -(b.capital + b.retained) + currentEarnings;
    return { assets: assets, liab: liab, equity: equity, currentEarnings: currentEarnings, check: assets - liab - equity };
  };

  // Year-end: close P&L accounts into retained earnings
  L.closeYear = function (fin) {
    var ni = 0;
    for (var k in fin.bal) {
      var t = A[k].t;
      if (t === 'R' || t === 'X') { ni -= fin.bal[k]; fin.bal[k] = 0; }
    }
    fin.bal.retained -= ni;
    return ni;
  };

  // ---------- Thai corporate income tax ----------
  // SME rates apply if paid-up capital <= 5M and annual revenue <= 30M
  L.citFor = function (profit, sme) {
    if (profit <= 0) return 0;
    if (!sme) return profit * 0.20;
    var t = 0;
    if (profit > 300000) t += (Math.min(profit, 3000000) - 300000) * 0.15;
    if (profit > 3000000) t += (profit - 3000000) * 0.20;
    return t;
  };

  // Called at fiscal year end (Dec). Returns {taxable, tax}
  L.yearEndTax = function (state) {
    var fin = state.fin, year = RW.T.info(state.time.w).year;
    var p = L.pnl(fin.ytd);
    var profit = p.ebt;
    // expire old losses (5 years)
    fin.taxLoss = fin.taxLoss.filter(function (l) { return year - l.year < 5; });
    var taxable = profit;
    if (profit > 0) {
      for (var i = 0; i < fin.taxLoss.length && taxable > 0; i++) {
        var use = Math.min(taxable, fin.taxLoss[i].amt);
        fin.taxLoss[i].amt -= use; taxable -= use;
      }
      fin.taxLoss = fin.taxLoss.filter(function (l) { return l.amt > 0; });
    } else if (profit < 0) {
      fin.taxLoss.push({ year: year, amt: -profit });
      taxable = 0;
    }
    var sme = (-fin.bal.capital) <= 5000000 && p.rev <= 30000000;
    var tax = L.citFor(taxable, sme);
    if (tax > 0) {
      L.post(fin, { tax_exp: tax, taxpay: -tax });
      fin.taxDue = { amt: tax, dueWeek: state.time.w + 21 }; // PND.50 due ~ end of May
    }
    fin.ytd = {};
    return { profit: profit, taxable: taxable, tax: tax, sme: sme };
  };

  // Pay corporate tax (WHT credits offset first)
  L.payTax = function (state) {
    var fin = state.fin;
    if (!fin.taxDue || state.time.w < fin.taxDue.dueWeek) return 0;
    var due = -fin.bal.taxpay;
    var credit = Math.min(fin.bal.whtc, due);
    var cashPart = due - credit;
    L.post(fin, { taxpay: due, whtc: -credit, cash: -cashPart }, 'op');
    fin.taxDue = null;
    return cashPart;
  };

  // WHT refund claims when no tax liability (Revenue Dept refunds slowly, may audit)
  L.claimWHTRefund = function (state) {
    var fin = state.fin;
    var amt = fin.bal.whtc;
    if (amt < 1000) return 0;
    state.flags.whtRefund = { amt: amt, week: state.time.w + RW.R.int(16, 40) };
    return amt;
  };

  // ---------- Thai labour law severance (Labour Protection Act, s.118) ----------
  L.severanceDays = function (tenureWeeks) {
    var days = tenureWeeks * 7;
    if (days < 120) return 0;
    if (days < 365) return 30;
    if (days < 365 * 3) return 90;
    if (days < 365 * 6) return 180;
    if (days < 365 * 10) return 240;
    if (days < 365 * 20) return 300;
    return 400;
  };

  L.socialSecurity = function (salary) { return Math.min(salary, 17500) * 0.05; };
})(globalThis.RW = globalThis.RW || {});
