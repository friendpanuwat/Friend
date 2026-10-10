/* RUNWAY — player actions (used by UI and by test bots). Each returns {ok, msg}. */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var A = (RW.Act = {});
  function ok(msg) { return { ok: true, msg: msg || '' }; }
  function no(msg) { return { ok: false, msg: msg }; }

  // ---------- Company ----------
  A.registerCompany = function (s) {
    if (s.company.registered || s.flags.registering) return no('จดทะเบียนแล้ว');
    L.spend(s.fin, 'prof', 12000);
    s.flags.registering = s.time.w + 2;
    return ok('ยื่นจดทะเบียนบริษัทจำกัดแล้ว (ค่าธรรมเนียม+ทนาย ฿12,000) ใช้เวลา ~2 สัปดาห์');
  };

  A.assignIP = function (s) {
    if (!s.flags.ipNotAssigned) return no('โอนสิทธิ์เรียบร้อยแล้ว');
    L.spend(s.fin, 'prof', 25000);
    s.flags.ipNotAssigned = 0;
    return ok('ทำสัญญาโอนทรัพย์สินทางปัญญาและข้อตกลงผู้ก่อตั้งเรียบร้อย (฿25,000)');
  };

  A.cleanBooks = function (s) {
    if (!s.flags.booksMessy) return no('บัญชีเรียบร้อยอยู่แล้ว');
    L.spend(s.fin, 'prof', 60000);
    s.flags.booksMessy = 0;
    return ok('จ้างสำนักงานบัญชีจัดระเบียบบัญชีย้อนหลัง (฿60,000)');
  };

  A.setAuditor = function (s, kind) {
    s.flags.auditor = kind; s.flags.auditorW = s.time.w;
    return ok(kind === 'big4' ? 'เปลี่ยนผู้สอบบัญชีเป็น Big4 — แพงขึ้นมาก แต่จำเป็นถ้าจะ IPO และนักลงทุนรายใหญ่เชื่อถือ' : 'ใช้ผู้สอบบัญชีท้องถิ่น');
  };

  A.setInsurance = function (s, on) { s.company.insured = !!on; return ok(on ? 'ซื้อประกันภัยธุรกิจแล้ว' : 'ยกเลิกประกันภัยแล้ว'); };

  A.claimWHT = function (s) {
    if (s.flags.whtRefund) return no('ยื่นขอคืนไปแล้ว รอผล');
    var amt = L.claimWHTRefund(s);
    return amt ? ok('ยื่นขอคืนภาษีหัก ณ ที่จ่าย ' + F.b(amt) + ' — สรรพากรใช้เวลาหลายเดือน') : no('ยอดเครดิตภาษีน้อยเกินไป');
  };

  A.officeQuote = function (s, type, seats) {
    var o = RW.OFFICES[type];
    if (type === 'home') return { rent: 0, deposit: 0, fitout: 0, seats: 3 };
    if (type === 'cowork') return { rent: seats * o.rentPerSeat + o.fixed, deposit: seats * o.rentPerSeat, fitout: 0, seats: seats };
    var sqm = seats * o.sqmPerSeat;
    return { rent: Math.round(sqm * o.rentSqm), deposit: Math.round(sqm * o.rentSqm * o.deposit), fitout: Math.round(sqm * o.fitoutSqm), seats: seats, sqm: sqm };
  };

  A.moveOffice = function (s, type, seats) {
    var cur = s.company.office;
    var o = RW.OFFICES[type];
    seats = Math.max(1, Math.min(o.cap, Math.round(seats || o.cap)));
    if (type === 'home') seats = 3;
    var q = A.officeQuote(s, type, seats);
    if (s.fin.bal.cash < q.deposit + q.fitout + 30000) return no('เงินสดไม่พอสำหรับมัดจำและตกแต่ง (' + F.b(q.deposit + q.fitout) + ')');
    var penalty = 0;
    // leaving a lease early
    if ((cur.type === 'small' || cur.type === 'gradeA')) {
      if (cur.leaseEnd > s.time.w) {
        penalty = cur.deposit; // forfeit deposit
        L.post(s.fin, { penalties: cur.deposit, prepaid: -cur.deposit });
      } else {
        L.post(s.fin, { cash: cur.deposit, prepaid: -cur.deposit }, 'op');
      }
      if (cur.fitoutId) L.writeOffAsset(s, cur.fitoutId);
    } else if (cur.type === 'cowork' && cur.deposit) {
      L.post(s.fin, { cash: cur.deposit, prepaid: -cur.deposit }, 'op');
    }
    var nw = { type: type, seats: seats, rent: q.rent, deposit: q.deposit, leaseEnd: o.lease ? s.time.w + Math.round(o.lease * 4.33) : 0 };
    if (q.deposit) L.post(s.fin, { prepaid: q.deposit, cash: -q.deposit }, 'op');
    if (q.fitout) {
      L.buyAsset(s, 'ตกแต่งออฟฟิศ ' + o.n, q.fitout, o.lease || 36);
      nw.fitoutId = s.fin.assets[s.fin.assets.length - 1].id;
    }
    if (type !== 'home') L.spend(s.fin, 'office', 30000);
    s.company.office = nw;
    return ok('ย้ายไป ' + o.n + ' (' + seats + ' ที่นั่ง)' + (penalty ? ' — ยึดเงินมัดจำเดิม ' + F.b(penalty) : ''));
  };

  // ---------- Founder ----------
  A.setHours = function (s, h) { s.founder.hours = U.clamp(Math.round(h), 30, 100); return ok(); };
  A.setFocus = function (s, key, v) { RW.Founder.setFocus(s, key, v); return ok(); };
  A.setFounderSalary = function (s, v) {
    s.founder.salary = Math.max(0, Math.round(v / 1000) * 1000);
    if (s.founder.salary > 250000 && s.funding.rounds.length) s.funding.board.confidence -= 5;
    return ok('ตั้งเงินเดือนผู้ก่อตั้ง ' + F.b(s.founder.salary));
  };
  A.vacation = function (s, weeks) {
    if (s.founder.vacation > 0) return no('กำลังลาพักอยู่');
    RW.Founder.takeVacation(s, weeks);
    return ok('ลาพักร้อน ' + weeks + ' สัปดาห์ บริษัทจะเดินโดยไม่มีคุณ');
  };
  A.lendToCompany = function (s, amt) {
    amt = Math.floor(amt / 10000) * 10000;
    if (amt <= 0 || amt > s.founder.cash) return no('เงินส่วนตัวไม่พอ');
    RW.Funding.takeDebt(s, 'founder', amt);
    return ok('ให้บริษัทกู้ยืม ' + F.b(amt) + ' จากเงินส่วนตัว');
  };
  A.repayFounderLoan = function (s, amt) {
    var ln = s.fin.loans.find(function (l) { return l.kind === 'founder'; });
    if (!ln) return no('ไม่มีเงินกู้จากผู้ก่อตั้ง');
    amt = Math.min(amt, ln.balance, Math.max(0, s.fin.bal.cash));
    if (amt <= 0) return no('เงินสดบริษัทไม่พอ');
    L.repayLoan(s, ln.id, amt);
    s.founder.cash += amt;
    return ok('บริษัทคืนเงินกู้ให้คุณ ' + F.b(amt));
  };
  A.injectEquity = function (s, amt) {
    if (s.funding.rounds.length || s.funding.safes.length) return no('มีนักลงทุนแล้ว — การเพิ่มทุนต้องผ่านรอบระดมทุน (ใช้เงินกู้ผู้ก่อตั้งแทน)');
    amt = Math.floor(amt / 10000) * 10000;
    if (amt <= 0 || amt > s.founder.cash) return no('เงินส่วนตัวไม่พอ');
    s.founder.cash -= amt;
    L.post(s.fin, { cash: amt, capital: -amt }, 'fin');
    return ok('เพิ่มทุนจดทะเบียน ' + F.b(amt) + ' จากเงินส่วนตัว');
  };

  // ---------- Team ----------
  A.openPosition = function (s, role, level, channel) {
    if (!s.company.registered) return no('ต้องจดทะเบียนบริษัทก่อนจึงจะจ้างพนักงานได้ (ขึ้นทะเบียนนายจ้างประกันสังคม)');
    if (s.team.openings.length >= 12) return no('เปิดรับพร้อมกันได้สูงสุด 12 ตำแหน่ง');
    RW.Team.openPosition(s, role, level, channel);
    return ok('เปิดรับสมัคร ' + RW.ROLES[role].n + ' (' + RW.LEVELS[level] + ')');
  };
  A.closePosition = function (s, id) { RW.Team.closePosition(s, id); return ok('ปิดประกาศแล้ว'); };
  A.offer = function (s, candId, salary, equityPct) {
    var shares = equityPct > 0 ? Math.round(RW.Funding.fullyDiluted(s) * equityPct) : 0;
    var r = RW.Team.makeOffer(s, candId, salary, shares);
    return { ok: r.ok, msg: r.msg, counter: r.counter };
  };
  A.rejectCandidate = function (s, candId) {
    s.team.candidates = s.team.candidates.filter(function (c) { return c.id !== candId; });
    return ok();
  };
  A.fire = function (s, id) {
    var e = RW.Team.find(s, id);
    if (!e) return no('ไม่พบพนักงาน');
    var cost = RW.Team.fire(s, id);
    return ok('เลิกจ้าง ' + e.name + (cost ? ' จ่ายค่าชดเชยและค่าจ้างแทนการบอกกล่าว ' + F.b(cost) : ' (อยู่ในช่วงทดลองงาน ไม่มีค่าชดเชย)'));
  };
  A.layoff = function (s, ids) {
    if (!ids.length) return no('ยังไม่ได้เลือกพนักงาน');
    var r = RW.Team.layoff(s, ids);
    s.stats.layoffs += r.n;
    return ok('เลิกจ้าง ' + r.n + ' คน ค่าชดเชยรวม ' + F.b(r.cost));
  };
  A.raise = function (s, id, pct) { RW.Team.giveRaise(s, id, pct); return ok('ปรับเงินเดือนแล้ว'); };
  A.promote = function (s, id) { return RW.Team.promote(s, id) ? ok('เลื่อนตำแหน่งแล้ว') : no('เลื่อนตำแหน่งไม่ได้'); };
  A.grantOptions = function (s, id, pct) {
    var e = RW.Team.find(s, id);
    if (!e) return no('ไม่พบพนักงาน');
    var sh = Math.round(RW.Funding.fullyDiluted(s) * pct);
    RW.Funding.grantOptions(s, e, sh);
    e.morale = U.clamp(e.morale + pct * 1500, 0, 100);
    return ok('มอบ ESOP ' + F.pct(pct, 2) + ' ให้ ' + e.name);
  };
  A.setPolicy = function (s, key, v) { s.team.policy[key] = v; return ok(); };

  // ---------- Funding ----------
  A.startRaise = function (s, opt) {
    if (!s.company.registered) return no('ต้องจดทะเบียนบริษัทก่อน นักลงทุนลงทุนในบุคคลธรรมดาไม่ได้');
    if (s.funding.raise) return no('กำลังระดมทุนอยู่');
    if (!(opt.target > 0) || !(opt.ask > 0)) return no('กรอกจำนวนเงินและมูลค่า');
    if (opt.instrument === 'safe') {
      var outstanding = U.sum(s.funding.safes, function (x) { return x.amount / x.cap; });
      if (opt.target / opt.ask + outstanding > 0.3) return no('SAFE ที่ค้างอยู่รวมกับรอบนี้จะทำให้นักลงทุนถือเกิน 30% — ลดเป้าหรือเพิ่ม valuation cap (หรือระดมแบบ priced round)');
    } else if (opt.target / (opt.ask + opt.target) > 0.4) return no('รอบนี้จะขายหุ้นเกิน 40% — นักลงทุนสถาบันจะไม่ยอม (ผู้ก่อตั้งเหลือหุ้นน้อยเกินไปจนหมดแรงจูงใจ)');
    RW.Funding.startRaise(s, opt);
    if (s.founder.focus.fundraise < 15) RW.Founder.setFocus(s, 'fundraise', 25);
    return ok('เริ่มระดมทุนแล้ว — เลือกนักลงทุนที่จะติดต่อ (เวลาของคุณกับงานนี้ถูกตั้งเป็น ' + s.founder.focus.fundraise + '%)');
  };
  A.pitch = function (s, invId) {
    if (!s.funding.raise) return no('ยังไม่ได้เปิดระดมทุน');
    return RW.Funding.pitch(s, invId) ? ok('ส่ง deck และขอนัดแล้ว') : no('ติดต่อไปแล้ว');
  };
  A.closeRound = function (s) {
    var r = s.funding.raise;
    if (!r || !r.leadId) return no('ยังไม่มี Lead investor');
    var c = RW.Funding.committed(s);
    if (c < r.minClose) return no('เงินที่ยืนยันแล้ว ' + F.m(c) + ' ยังไม่ถึงขั้นต่ำ ' + F.m(r.minClose));
    RW.Funding.startClosing(s);
    return ok('เริ่มปิดรอบ — ทนายกำลังร่างสัญญา');
  };
  A.endSafeRound = function (s) {
    var r = s.funding.raise;
    if (!r || r.instrument !== 'safe') return no('ไม่มีรอบ SAFE ที่เปิดอยู่');
    s.funding.raise = null;
    return ok('ปิดรอบ SAFE แล้ว');
  };
  A.cancelRaise = function (s) { RW.Funding.cancelRaise(s); return ok('ยุติการระดมทุน'); };
  A.takeDebt = function (s, kind, amt) { return RW.Funding.takeDebt(s, kind, amt) ? ok('ได้รับเงินกู้ ' + F.b(amt)) : no('ไม่ผ่านเงื่อนไขสินเชื่อ'); };
  A.repayLoan = function (s, id, amt) {
    if (s.fin.bal.cash < amt) return no('เงินสดไม่พอ');
    var p = L.repayLoan(s, id, amt);
    return ok('ชำระคืน ' + F.b(p));
  };
  A.toggleUpdates = function (s) { s.funding.updates = !s.funding.updates; return ok(s.funding.updates ? 'จะส่ง Investor update ทุกเดือน' : 'หยุดส่ง Investor update'); };
  A.network = function (s) {
    if (s.founder.energy < 15) return no('คุณเหนื่อยเกินไป');
    s.founder.energy -= 8;
    var stage = RW.Funding.stageOfRaise(s);
    var invs = RW.Funding.eligibleInvestors(s, stage);
    var picked = R.shuffle(invs).slice(0, 3);
    picked.forEach(function (i) { i.warm = Math.min(1.5, i.warm + 0.35); });
    L.spend(s.fin, 'travel', 8000);
    return ok('ไปงาน networking ได้ทำความรู้จัก ' + picked.map(function (i) { return i.name; }).join(', '));
  };
  A.hireBanker = function (s) {
    if (s.flags.banker && s.flags.banker > s.time.w) return no('จ้างที่ปรึกษา M&A อยู่แล้ว');
    if ((s.kpi.traction || 0) < 25) return no('บริษัทยังเล็กเกินไปสำหรับวาณิชธนกิจ');
    L.spend(s.fin, 'prof', 1500000);
    s.flags.banker = s.time.w + 26;
    return ok('จ้างที่ปรึกษา M&A (retainer ฿1.5M) — จะหาผู้ซื้อให้ภายใน 6 เดือน');
  };
  A.startIPO = function (s) { return RW.Engine.startIPO(s) ? ok('เริ่มกระบวนการ IPO') : no('ยังไม่ผ่านเกณฑ์'); };
  A.shutdown = function (s) {
    // orderly wind-down: pay severance, settle liabilities, distribute remainder per waterfall
    var sev = U.sum(RW.Team.all(s), function (e) { return RW.Team.severanceCost(s, e); });
    var bs = L.balanceSheet(s.fin);
    var liquid = s.fin.bal.cash + s.fin.bal.ar * 0.7 + s.fin.bal.inventory * 0.3 + s.fin.bal.prepaid * 0.5;
    var debts = -(s.fin.bal.ap + s.fin.bal.loans + s.fin.bal.taxpay + s.fin.bal.accrued);
    var founderLoan = U.sum(s.fin.loans.filter(function (l) { return l.kind === 'founder'; }), function (l) { return l.balance; });
    var residual = Math.max(0, liquid - sev - debts - 300000);
    var loanBack = Math.min(founderLoan, Math.max(0, liquid - sev - (debts - founderLoan) - 300000));
    var wf = RW.Funding.waterfall(s, Math.max(0, residual - loanBack));
    s.founder.cash += loanBack + wf.founder;
    RW.Engine.gameOver(s, 'shutdown', 'คุณตัดสินใจปิดบริษัทอย่างมีระเบียบ จ่ายค่าชดเชยพนักงาน ' + F.b(sev) + ' ชำระหนี้ และคืนเงินที่เหลือให้ผู้ถือหุ้น' + (loanBack + wf.founder > 0 ? ' — คุณได้คืน ' + F.b(loanBack + wf.founder) : ''));
    return ok('ปิดบริษัทแล้ว');
  };
  A.continueEndless = function (s) { s.flags.endless = 1; return ok('โหมดเล่นต่อไม่จำกัดเวลา'); };

  // ---------- Annual HR decisions ----------
  RW.Events.register({
    id: 'year_end_bonus', cat: 'team',
    title: 'โบนัสปลายปี',
    body: function (s) {
      var emps = RW.Team.active(s).filter(function (e) { return s.time.w - e.startW > 13; });
      var m1 = U.sum(emps, function (e) { return e.salary; });
      return 'ธันวาคมมาถึงแล้ว พนักงาน ' + emps.length + ' คนที่ทำงานเกิน 3 เดือนรอฟังข่าวโบนัส ในไทยโบนัส 1 เดือน (เงินเดือนที่ 13) ถือเป็นมาตรฐานที่หลายคนคาดหวัง\n\nโบนัส 1 เดือน = ' + F.b(m1) + ' · เงินสดตอนนี้ ' + F.b(s.fin.bal.cash) + ' · Runway ' + F.months(s.kpi.runway);
    },
    choices: function (s) {
      return [0, 0.5, 1, 1.5, 2].map(function (m) {
        return { t: m === 0 ? 'ไม่มีโบนัสปีนี้' : 'โบนัส ' + m + ' เดือน', fx: function () { s.team.policy.bonusMonths = m; var c = RW.Team.yearEndBonus(s); return m ? 'จ่ายโบนัสรวม ' + F.b(c) : 'ประกาศงดโบนัส ทีมผิดหวัง'; } };
      });
    }
  });
  RW.Events.register({
    id: 'annual_review', cat: 'team',
    title: 'ปรับเงินเดือนประจำปี',
    body: function (s) {
      var exp = (s.world.wageIndexYoY || RW.MACRO[s.world.phase].wage) - 1;
      return 'ถึงรอบประเมินผลประจำปี เงินเฟ้อและตลาดแรงงานทำให้พนักงานคาดหวังการปรับขึ้นประมาณ ' + F.pct(exp, 1) + '\nต้นทุนเงินเดือนรวมต่อเดือนตอนนี้ ' + F.b(RW.Team.monthlyCost(s));
    },
    choices: function (s) {
      return [0, 0.03, 0.05, 0.08].map(function (p) {
        return { t: p === 0 ? 'ไม่ขึ้นปีนี้ (ตรึงเงินเดือน)' : 'ขึ้นเฉลี่ย ' + (p * 100) + '%', fx: function () { var d = RW.Team.annualRaises(s, p); return p ? 'ต้นทุนต่อเดือนเพิ่มขึ้น ' + F.b(d) : 'ตรึงเงินเดือน'; } };
      });
    }
  });
})(globalThis.RW = globalThis.RW || {});
