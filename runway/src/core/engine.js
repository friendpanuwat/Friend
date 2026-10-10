/* RUNWAY — engine: new game, weekly tick, month close, KPIs, game over, exit, scoring, advisor, actions */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger, T = RW.T;
  var EN = (RW.Engine = {});
  RW.Models = RW.Models || {};
  RW.VERSION = 3;
  RW.MAX_WEEKS = 520; // 10 years

  // ---------- New game ----------
  EN.newGame = function (opt) {
    var seed = opt.seed != null ? opt.seed : Math.floor(Math.random() * 2e9);
    var rng = { s: seed | 0 };
    R.bind(rng);
    var diff = U.deepCopy(RW.DIFFICULTY[opt.difficulty || 'normal']);
    diff.key = opt.difficulty || 'normal';
    var ch = RW.CHALLENGES[opt.challenge] ? opt.challenge : 'none';
    var state = {
      v: RW.VERSION, seed: seed, rng: rng, industry: opt.industry, diff: diff,
      company: { name: opt.companyName || 'บริษัทของฉัน', registered: false, registerW: null, office: { type: 'home', seats: 3, rent: 0, leaseEnd: 0, deposit: 0 }, insured: false, extraAdmin: 0, foundedW: 0 },
      time: { w: 0 }, flags: {}, stats: { raised: 0, peakHC: 0, maxRevenueMonth: 0, layoffs: 0 },
      inbox: [], hist: { weekly: [], monthly: [] }, achievements: {}, over: null, cofounders: [], kpi: {},
      challenge: ch, maxW: ch === 'sprint' ? 260 : RW.MAX_WEEKS, research: []
    };
    state.founder = RW.Founder.init({ name: opt.founderName, bg: opt.bg, extraCash: diff.cash });
    state.team = RW.Team.init();
    state.fin = L.init();
    state.world = RW.World.init(state, ch === 'crisis' ? 'recession' : diff.macro);
    if (ch === 'crisis') { state.world.vc = Math.min(state.world.vc, 0.5); state.world.talentSupply = 1.35; }
    state.events = RW.Events.init();
    state.funding = RW.Funding.init(state);
    var M = RW.Models[opt.industry];
    state.biz = M.init(state, opt);
    // equity split
    var fShares = RW.Funding.FOUNDER_SHARES;
    var h = RW.Funding.holder(state, 'founder');
    if (opt.cofounder) {
      var c = opt.cofounder;
      var cfShares = Math.round(fShares * c.ask / (1 - c.ask));
      state.cofounders.push({ id: c.id, name: c.name, nick: c.nick, role: c.role, skill: c.skill, salary: c.salary, trait: c.trait, morale: 75, conflict: c.trait === 'stubborn' ? 20 : 5, active: true, joinW: 0, boardSeat: true, equity: c.ask });
      RW.Funding.addHolder(state, { id: c.id, name: c.name + ' (ผู้ร่วมก่อตั้ง)', kind: 'cofounder', cls: 'common', shares: cfShares });
      state.funding.board.founderSeats = 1;
      if (opt.vesting) state.flags.cofounderVesting = 1;
      if (c.cash > 0) {
        L.post(state.fin, { cash: c.cash, capital: -c.cash }, 'fin');
      }
    }
    h.shares = fShares;
    var cap = Math.min(opt.capital || 0, state.founder.cash);
    if (cap > 0) {
      state.founder.cash -= cap;
      L.post(state.fin, { cash: cap, capital: -cap }, 'fin');
    }
    state.fin.month = L.blankMonth();
    state.flags.ipNotAssigned = 1;
    state.flags.booksMessy = 1;
    EN.computeKPIs(state);
    EN.mail(state, 'system', 'ยินดีต้อนรับสู่วันแรกของ ' + state.company.name, M.welcome(state), 'info');
    return state;
  };

  // bring older saves up to date
  EN.migrate = function (s) {
    Object.keys(RW.ACCOUNTS).forEach(function (k) { if (s.fin.bal[k] == null) s.fin.bal[k] = 0; });
    s.founder.focus.consult = s.founder.focus.consult || 0;
    if (!s.research) s.research = [];
    if (!s.challenge) s.challenge = 'none';
    if (!s.maxW) s.maxW = RW.MAX_WEEKS;
    return s;
  };

  // ---------- Annual strategy themes ----------
  EN.THEMES = {
    blitz: { n: 'Blitzscaling — โตให้เร็วที่สุด', d: 'การตลาดได้ผลขึ้น 12% จ้างคนได้เร็วขึ้น แต่ทีมเครียดขึ้น บอร์ดชอบการเติบโต', mkt: 1.12, dev: 1, morale: -2, quit: 1.1, opex: 1, hire: 1.3, stress: 3 },
    alive: { n: 'Default alive — มุ่งสู่จุดคุ้มทุน', d: 'ค่าใช้จ่ายสำนักงานลด 15% ทุกคนประหยัด บอร์ดและนักลงทุนเห็นวินัย แต่ทีมรู้สึกว่าบริษัทไม่โต', mkt: 0.97, dev: 1, morale: -1, quit: 1, opex: 0.85, hire: 0.9, stress: 0 },
    product: { n: 'Product excellence — สินค้าต้องดีที่สุด', d: 'ทีมพัฒนาสินค้า/R&D ทำงานได้ผลขึ้น 12% คุณภาพดีขึ้น แต่การขายไม่ได้แรงพิเศษ', mkt: 1, dev: 1.12, morale: 1, quit: 1, opex: 1, hire: 1, stress: 0 },
    people: { n: 'People first — ทีมคือทุกอย่าง', d: 'ขวัญกำลังใจ +6 คนลาออกน้อยลง 25% และสรรหาคนง่ายขึ้น แต่ต้องใช้เวลาและงบดูแลคน', mkt: 1, dev: 1, morale: 6, quit: 0.75, opex: 1.05, hire: 1.15, stress: -2 }
  };
  EN.theme = function (state) {
    var t = state.flags.theme;
    return t && t.until > state.time.w ? EN.THEMES[t.k] : null;
  };
  EN.tm = function (state, key) { var t = EN.theme(state); return t ? t[key] : (key === 'morale' || key === 'stress' ? 0 : 1); };

  // ---------- Mail / inbox ----------
  EN.mail = function (state, cat, title, body, tone) {
    state.inbox.unshift({ id: R.id('m'), w: state.time.w, cat: cat, title: title, body: body || '', tone: tone || 'info', read: false });
    if (state.inbox.length > 250) state.inbox.length = 250;
  };

  // ---------- BOI investment promotion ----------
  EN.BOI = {
    saas: { n: 'กิจการพัฒนาซอฟต์แวร์และบริการดิจิทัล', years: 5, cap: 1e15 }, // effectively uncapped (Infinity doesn't survive JSON saves)
    fnb: { n: 'กิจการผลิตอาหารแปรรูป (ครัวกลาง)', years: 3, cap: 7.5e6 }
  };
  EN.boiCheck = function (state) {
    var cat = EN.BOI[state.industry];
    if (!cat) return { cat: null, reqs: [], ok: false };
    var reqs = [
      { t: 'จดทะเบียนบริษัทแล้ว', ok: state.company.registered },
      { t: 'ทุนจดทะเบียนชำระแล้ว ≥ ฿1M', ok: -state.fin.bal.capital >= 1e6 },
      { t: 'ระบบบัญชีเรียบร้อย', ok: !state.flags.booksMessy }
    ];
    if (state.industry === 'saas') {
      var tech = RW.Team.active(state).filter(function (e) { return ['eng', 'data', 'design', 'pm'].indexOf(e.role) >= 0; }).length;
      reqs.push({ t: 'ทีมพัฒนาที่เป็นพนักงานประจำ ≥ 3 คน (มี ' + tech + ')', ok: tech >= 3 });
      reqs.push({ t: 'ทรัพย์สินทางปัญญาเป็นของบริษัท', ok: !state.flags.ipNotAssigned });
    } else reqs.push({ t: 'มีครัวกลางที่เปิดใช้งานแล้ว', ok: !!(state.biz.ck && state.biz.ck.ready <= state.time.w) });
    return { cat: cat, reqs: reqs, ok: reqs.every(function (r) { return r.ok; }) };
  };
  EN.boiDecision = function (state) {
    var app = state.flags.boiApp, cat = EN.BOI[state.industry];
    state.flags.boiApp = null;
    if (EN.boiCheck(state).ok && R.chance(0.85)) {
      state.flags.boi = { startW: state.time.w, until: state.time.w + cat.years * 52, cap: cat.cap, used: 0 };
      EN.mail(state, 'admin', 'ได้รับบัตรส่งเสริมการลงทุน (BOI)', cat.n + ' — ยกเว้นภาษีเงินได้นิติบุคคล ' + cat.years + ' ปีนับจากวันนี้' + (cat.cap < 1e14 ? ' (สูงสุด ' + F.m(cat.cap) + ')' : '') + ' · ต้องส่งรายงานความก้าวหน้าทุกปี', 'good');
    } else EN.mail(state, 'admin', 'BOI ยังไม่อนุมัติ', 'เจ้าหน้าที่ขอข้อมูลเพิ่มและเห็นว่าโครงการยังไม่ครบเงื่อนไข — ยื่นใหม่ได้เมื่อพร้อม', 'bad');
  };

  // ---------- Paid market research (results arrive after a few weeks) ----------
  EN.researchWeekly = function (state) {
    var M = RW.Models[state.industry], w = state.time.w;
    if (!state.research || !state.research.length || !M.RESEARCH) return;
    state.research = state.research.filter(function (j) {
      if (j.due > w) return true;
      var r = M.RESEARCH[j.k];
      var msg = r ? r.done(state, j.arg) : '';
      if (msg) EN.mail(state, 'product', 'ผลวิจัยมาแล้ว: ' + r.n, msg, 'good');
      return false;
    });
  };

  // ---------- Weekly tick ----------
  EN.tick = function (state) {
    if (state.over) return;
    R.bind(state.rng);
    var M = RW.Models[state.industry];
    state.time.w++;
    var w = state.time.w;
    var info = T.info(w);
    state.fin.week = { op: 0, inv: 0, fin: 0 };

    // flags that expire
    if (state.flags.frozen && w >= state.flags.frozen.until) {
      var amt = state.flags.frozen.amt;
      L.post(state.fin, { cash: amt, prepaid: -amt }, 'op');
      EN.mail(state, 'finance', 'เงินฝากที่ถูกแช่แข็งได้คืนแล้ว', F.b(amt) + ' กลับเข้าบัญชีบริษัท', 'good');
      state.flags.frozen = null;
    }
    if (state.flags.registering && w >= state.flags.registering) {
      state.company.registered = true; state.company.registerW = w; state.flags.registering = 0;
      EN.mail(state, 'admin', 'จดทะเบียนบริษัทสำเร็จ', 'บริษัท ' + state.company.name + ' จำกัด ได้รับเลขทะเบียนนิติบุคคลแล้ว เปิดบัญชีธนาคารบริษัท ขึ้นทะเบียนนายจ้างประกันสังคมได้ ออกใบกำกับภาษีได้ ระดมทุนได้', 'good');
    }
    if (state.flags.accelerator && w >= state.flags.accelerator.until) {
      state.flags.accelerator = null;
      state.funding.investors.forEach(function (i) { if (i.type !== 'growth') i.warm = Math.min(1.5, i.warm + 0.35); });
      state.founder.rep += 4;
      EN.mail(state, 'funding', 'Demo Day!', 'คุณพิตช์ต่อหน้านักลงทุนกว่า 100 ราย หลายรายขอนัดคุยต่อ — ถ้าจะระดมทุน ตอนนี้คือจังหวะดี', 'good');
    }
    if (state.flags.burnPromise && w >= state.flags.burnPromise.w) {
      var ok = (state.kpi.burn || 0) <= state.flags.burnPromise.burn * 1.05;
      state.funding.board.confidence = U.clamp(state.funding.board.confidence + (ok ? 12 : -22), 0, 100);
      EN.mail(state, 'funding', ok ? 'คุณลด burn ได้ตามที่สัญญาบอร์ด' : 'คุณผิดสัญญาที่ให้ไว้กับบอร์ด', ok ? 'ความเชื่อมั่นของบอร์ดดีขึ้น' : 'Burn ยังสูงกว่าที่สัญญาไว้ ความน่าเชื่อถือของคุณในสายตาบอร์ดลดลงมาก', ok ? 'good' : 'bad');
      state.flags.burnPromise = null;
    }
    if (state.flags.ipo && w >= state.flags.ipo.w) { EN.completeIPO(state); if (state.over) return; }
    if (state.flags.boiApp && w >= state.flags.boiApp.w) EN.boiDecision(state);

    RW.Team.computeCaps(state);
    if (state.flags.companyOff && state.flags.companyOff >= w) {
      Object.keys(state.caps).forEach(function (k) { if (k !== 'mgmtEff') state.caps[k] *= 0.15; });
    }
    if (state.flags.accelerator) Object.keys(state.caps).forEach(function (k) { if (k.indexOf('f_') === 0 || k === 'dev' || k === 'sales') state.caps[k] *= 0.88; });
    RW.Founder.weekly(state);
    RW.Founder.cofounderWeekly(state);
    RW.Team.weekly(state);
    M.weekly(state, info);
    EN.researchWeekly(state);
    var ci = RW.Founder.consultIncome(state);
    if (ci > 0) {
      if (state.company.registered) L.invoice(state, 'rev_consult', ci, w + 4, { wht: true, name: 'งานที่ปรึกษา/รับจ้าง' });
      else state.founder.cash += ci * 0.9;
      state.stats.consult = (state.stats.consult || 0) + ci;
    }
    var ar = L.collectAR(state);
    if (ar.badDebt > 0) EN.mail(state, 'finance', 'ตัดหนี้สูญ ' + F.b(ar.badDebt), 'ลูกค้าบางรายค้างชำระเกิน 4 เดือนและติดต่อไม่ได้', 'bad');
    if (state.flags.whtRefund && w >= state.flags.whtRefund.week) {
      var wr = Math.min(state.flags.whtRefund.amt, state.fin.bal.whtc);
      if (wr > 0) { L.post(state.fin, { cash: wr, whtc: -wr }, 'op'); EN.mail(state, 'finance', 'ได้รับคืนภาษีหัก ณ ที่จ่าย', F.b(wr) + ' — หลังจากรอสรรพากรพิจารณาหลายเดือน', 'good'); }
      state.flags.whtRefund = null;
    }
    RW.Funding.weekly(state);
    if (info.monthEnd) EN.monthEnd(state, info);
    RW.Events.weekly(state);
    // weekly cash flow record
    var wk = state.fin.week;
    state.hist.weekly.push({ w: w, cash: state.fin.bal.cash, op: wk.op, inv: wk.inv, fin: wk.fin, rev: state.biz.weekRev || 0 });
    if (state.hist.weekly.length > 160) state.hist.weekly.shift();
    EN.computeKPIs(state);
    EN.checkSolvency(state, info);
    EN.checkAchievements(state);
    state.stats.peakHC = Math.max(state.stats.peakHC, RW.Team.headcount(state));
    if (w >= EN.maxW(state) && !state.over && !state.flags.endless) EN.timeUp(state);
  };

  EN.monthEnd = function (state, info) {
    var M = RW.Models[state.industry];
    var fin = state.fin, w = state.time.w;
    // payroll
    var pr = RW.Team.payroll(state, info);
    var cashBefore = fin.bal.cash + fin.creditLine;
    RW.Team.postPayroll(state, pr);
    if (cashBefore < pr.gross && pr.gross > 0) {
      state.flags.payrollMissed = w;
      state.stats.missedPayroll = (state.stats.missedPayroll || 0) + 1;
      RW.Team.addMod(state, -25, 16, 'บริษัทจ่ายเงินเดือนไม่ได้');
      state.team.brand = Math.max(0, state.team.brand - 20);
      EN.mail(state, 'finance', 'จ่ายเงินเดือนไม่ครบ!', 'เงินในบัญชีไม่พอจ่ายเงินเดือนพนักงาน (ต้องการ ' + F.b(pr.gross) + ') พนักงานตกใจและเริ่มหางานใหม่ หากค้างจ่ายต่อเนื่อง พนักงานสามารถร้องเรียนพนักงานตรวจแรงงานได้', 'bad');
    }
    // office & overhead
    var o = state.company.office;
    var rent = o.type === 'cowork' ? o.seats * RW.OFFICES.cowork.rentPerSeat + RW.OFFICES.cowork.fixed : o.rent || 0;
    if (rent) L.spend(fin, 'rent', rent);
    if (o.type === 'small' || o.type === 'gradeA') L.spend(fin, 'utilities', Math.round(o.seats * 900));
    var hc = RW.Team.headcount(state) + 1 + (state.cofounders || []).filter(function (c) { return c.active; }).length;
    L.spend(fin, 'software', 1500 + hc * (state.industry === 'fnb' ? 400 : 1800));
    var hasFinance = RW.Team.capOf(state, 'finance') > 0.3;
    if (state.company.registered && !hasFinance) L.spend(fin, 'prof', 6500 + Math.min(25000, (state.kpi.revenueMonthly || 0) * 0.004));
    if (state.company.extraAdmin) L.spend(fin, 'prof', state.company.extraAdmin);
    if (state.company.insured) L.spend(fin, 'insurance', RW.Events.insuranceCost(state));
    if (state.flags.boi && w < state.flags.boi.until) L.spend(fin, 'prof', 6000); // BOI progress reports & compliance
    L.spend(fin, 'office', Math.round((hc * 600 + 1000) * EN.tm(state, 'opex')));
    // model month end (hosting, inventory valuation, branch costs...)
    M.monthly(state, info);
    // loans & depreciation
    var revThisMonth = -L.sumGroup(fin.month.pl, 'rev');
    L.serviceLoans(state, revThisMonth);
    L.depreciate(state);
    // interest on cash (bank savings)
    if (fin.bal.cash > 1e6) { var ii = fin.bal.cash * state.world.macro.rate * 0.6 / 12; L.post(fin, { cash: ii, int_income: -ii }, 'op'); }
    // founder personal finances
    RW.Founder.monthly(state);
    // world
    RW.World.monthly(state);
    // annual cycles
    if (info.month === 3 && state.company.registered && state.time.w > 20) {
      var auditFee = state.flags.auditor === 'big4' ? Math.max(450000, revThisMonth * 12 * 0.004) : Math.max(35000, Math.min(250000, revThisMonth * 12 * 0.002));
      L.spend(fin, 'prof', auditFee);
      EN.mail(state, 'admin', 'ค่าสอบบัญชีประจำปี', 'จ่ายค่าผู้สอบบัญชีรับอนุญาต (CPA) ' + F.b(auditFee) + ' เพื่อยื่นงบการเงินต่อกรมพัฒนาธุรกิจการค้าและสรรพากร');
      state.flags.booksMessy = 0;
    }
    if (fin.taxDue && w >= fin.taxDue.dueWeek - 2) {
      var paid = L.payTax(state);
      if (paid > 0) EN.mail(state, 'finance', 'ชำระภาษีเงินได้นิติบุคคล (ภ.ง.ด.50)', 'จ่ายภาษี ' + F.b(paid) + ' (หักเครดิตภาษีถูกหัก ณ ที่จ่ายแล้ว)');
    }
    if (info.month === 11) {
      var tx = L.yearEndTax(state);
      L.closeYear(fin);
      state.ytdClosed = tx;
      EN.mail(state, 'finance', 'ปิดงบประจำปี ' + info.be, 'กำไร(ขาดทุน)ก่อนภาษี ' + F.b(tx.profit) + (tx.tax > 0 ? ' · ภาษีที่ต้องจ่ายในเดือน พ.ค. ' + F.b(tx.tax) + (tx.sme ? ' (อัตรา SME)' : '') : tx.exempt > 0 ? '' : ' · ขาดทุนสะสมยกไปใช้ลดภาษีได้ 5 ปี') + (tx.exempt > 0 ? ' · ได้รับยกเว้นภาษีจาก BOI ' + F.b(tx.exempt) : ''), tx.profit > 0 ? 'good' : 'info');
      if (tx.profit > 0) state.achievements.profitable_year = state.achievements.profitable_year || w;
      if (RW.Team.active(state).length > 0) RW.Events.queue(state, 'year_end_bonus', {});
    }
    if (info.month === 0 && state.time.w > 10 && RW.Team.active(state).length > 0) RW.Events.queue(state, 'annual_review', {});
    if (info.month === 11) RW.Events.queue(state, 'annual_strategy', {}, state.time.w + 1);
    // VAT threshold
    var ttm = EN.revenueTTM(state) + revThisMonth;
    if (!fin.vat.registered && !fin.vat.required && ttm > 1.8e6) { fin.vat.required = true; RW.Events.queue(state, 'vat_register', {}); }
    // quarter: board
    if (info.quarterEnd) { EN.computeKPIs(state); RW.Funding.boardQuarterly(state); }
    if (state.funding.updates && state.funding.rounds.length) {
      state.funding.relations = U.clamp(state.funding.relations + 1.2, 0, 100);
    }
    RW.Funding.maybeAcquisitionOffer(state);
    // snapshot & reset
    var pl = fin.month.pl;
    var p = L.pnl(pl);
    var bs = L.balanceSheet(fin);
    var mk = M.monthKPIs ? M.monthKPIs(state) : {};
    var snap = {
      m: info.monthsElapsed, label: T.monthLabel(info.monthsElapsed), w: w, pl: U.deepCopy(pl), p: p, cf: U.deepCopy(fin.month.cf),
      bal: U.deepCopy(fin.bal), bs: bs, hc: RW.Team.headcount(state), cash: fin.bal.cash, k: mk,
      morale: RW.Team.avgMorale(state), founderPct: RW.Funding.founderPct(state), valuation: state.funding.lastPost, payroll: pr.gross
    };
    state.hist.monthly.push(snap);
    if (state.hist.monthly.length > 132) state.hist.monthly.shift();
    state.stats.maxRevenueMonth = Math.max(state.stats.maxRevenueMonth, p.rev);
    fin.month = L.blankMonth();
    EN.monthlyReport(state, snap);
  };

  EN.revenueTTM = function (state) {
    return U.sum(U.last(state.hist.monthly, 12), function (m) { return m.p.rev; });
  };

  EN.monthlyReport = function (state, s) {
    var prev = state.hist.monthly.length > 1 ? state.hist.monthly[state.hist.monthly.length - 2] : null;
    var g = prev && prev.p.rev > 0 ? s.p.rev / prev.p.rev - 1 : null;
    var M = RW.Models[state.industry];
    var body = 'รายได้ ' + F.b(s.p.rev) + (g != null ? ' (' + F.spct(g) + ' MoM)' : '') + ' · กำไรขั้นต้น ' + F.pct(s.p.gm) + ' · EBITDA ' + F.b(s.p.ebitda) +
      '\nเงินสดปลายเดือน ' + F.b(s.cash) + ' · Burn ' + F.b(state.kpi.burn) + '/เดือน · Runway ' + F.months(state.kpi.runway) + ' · พนักงาน ' + s.hc + ' คน' +
      (M.reportLine ? '\n' + M.reportLine(state) : '');
    EN.mail(state, 'report', 'สรุปผลประกอบการ ' + T.MONTHS_FULL[s.m % 12] + ' ' + (T.START_YEAR + Math.floor(s.m / 12) + 543), body, s.p.ebitda >= 0 ? 'good' : 'info');
  };

  // ---------- KPIs ----------
  EN.computeKPIs = function (state) {
    var M = RW.Models[state.industry];
    var k = state.kpi || {};
    var hm = state.hist.monthly;
    var wk = state.hist.weekly;
    k.cash = state.fin.bal.cash;
    // burn: net operating + investing outflow, averaged over last ~13 weeks
    var n = Math.min(13, wk.length);
    var burn;
    if (n >= 4) {
      var net = U.sum(U.last(wk, n), function (x) { return x.op + x.inv; });
      burn = -net / n * 4.333;
    } else {
      burn = EN.forecastMonthlyCost(state) - (M.forecastRevenue ? M.forecastRevenue(state) : 0);
    }
    k.burn = burn;
    k.runway = burn > 0 ? Math.max(0, k.cash) / burn : Infinity;
    var last = hm.length ? hm[hm.length - 1] : null;
    // operating KPIs exclude the founder's side consulting (investors don't count it as traction)
    var core = function (m) { return m ? m.p.rev + (m.pl.rev_consult || 0) + (m.pl.rev_oneoff || 0) : 0; };
    k.revenueMonthly = core(last);
    k.revenueTotal = last ? last.p.rev : 0;
    k.revenueTTM = U.sum(U.last(hm, 12), core);
    k.ebitdaTTM = U.sum(U.last(hm, 12), function (m) { return m.p.ebitda; });
    k.ebitdaMargin = last && last.p.rev > 0 ? last.p.ebitda / last.p.rev : -1;
    k.gm = last ? last.p.gm : 0;
    var r3 = hm.length >= 4 ? core(hm[hm.length - 4]) : 0;
    var r0 = core(last);
    k.qoqGrowth = r3 > 0 && last ? r0 / r3 - 1 : 0;
    var r1 = hm.length >= 2 ? core(hm[hm.length - 2]) : 0;
    k.momGrowth = r1 > 0 && last ? r0 / r1 - 1 : 0;
    k.cmgr3 = r3 > 0 && r0 > 0 ? Math.pow(r0 / r3, 1 / 3) - 1 : 0;
    var prevTTM = hm.length >= 24 ? U.sum(hm.slice(-24, -12), core) : 0;
    k.yoyGrowth = prevTTM > 0 ? k.revenueTTM / prevTTM - 1 : 0;
    k.headcount = RW.Team.headcount(state);
    k.morale = RW.Team.avgMorale(state);
    k.founderPct = RW.Funding.founderPct(state);
    // model-specific metrics (arr, customers, traction, share, workload, momentum...)
    var mk = M.kpis(state);
    for (var key in mk) k[key] = mk[key];
    // momentum for morale: revenue growth and press
    k.momentum = U.clamp((k.cmgr3 || 0) * 60, -10, 10) + (state.funding.raise && state.funding.raise.leadId ? 3 : 0);
    // burn multiple: net burn / net new ARR (annualized revenue added)
    var newRunRate = last && hm.length >= 4 ? (r0 - r3) * 12 / 3 : 0;
    k.burnMultiple = newRunRate > 0 && burn > 0 ? burn * 12 / 3 / (newRunRate / 4) : (burn > 0 ? 99 : 0);
    k.defaultAlive = EN.defaultAlive(state);
    var tr = M.traction(state);
    k.traction = tr.score * (state.flags.inflate && state.flags.inflate > state.time.w ? 1.2 : 1);
    k.tractionInfo = tr;
    state.kpi = k;
    return k;
  };

  EN.forecastMonthlyCost = function (state) {
    var M = RW.Models[state.industry];
    var o = state.company.office;
    var rent = o.type === 'cowork' ? o.seats * RW.OFFICES.cowork.rentPerSeat + RW.OFFICES.cowork.fixed : o.rent || 0;
    return RW.Team.monthlyCost(state) + rent + (M.forecastCost ? M.forecastCost(state) : 0) + 8000;
  };

  // 12-month cash projection for planning. opt: { g: monthly growth, cut: share of non-payroll fixed costs cut,
  // freeze: cancel hires not yet started, hires: extra headcount, salary: their monthly salary }
  EN.cashForecast = function (state, opt) {
    opt = opt || {};
    var hm = U.last(state.hist.monthly, 3), w = state.time.w, M = RW.Models[state.industry];
    var pol = state.team.policy;
    function empCost(sal) { return sal + L.socialSecurity(sal) + RW.POLICIES.benefits[pol.benefits].cost + RW.POLICIES.culture[pol.culture].cost; }
    var rev0 = 0, varR = 0, fixed0, collect = 1, side0 = 0;
    // cash collected per baht of revenue: annual prepayments raise it, slow-paying invoices lower it
    var h4 = U.last(state.hist.monthly, 4);
    if (h4.length >= 2) {
      var rc = 0, rv = 0;
      for (var j = 1; j < h4.length; j++) {
        var a = h4[j], pv = h4[j - 1];
        rv += a.p.rev;
        rc += a.p.rev - ((a.bal.ar || 0) - (pv.bal.ar || 0)) - ((a.bal.deferred || 0) - (pv.bal.deferred || 0));
      }
      if (rv > 0) collect = U.clamp(1 + (rc / rv - 1) * 0.6, 0.8, 1.4); // damped: one lumpy month shouldn't dominate
    }
    if (hm.length) {
      var R0 = 0, V0 = 0, Fx = 0, C0 = 0;
      hm.forEach(function (m) {
        var side = -(m.pl.rev_consult || 0), once = -(m.pl.rev_oneoff || 0);
        C0 += side;
        var cash = m.p.cogs + m.p.opex - (m.pl.depr || 0);
        var variable = m.p.cogs - (state.industry === 'fnb' ? 0 : (m.pl.cogs_staff || 0));
        var payroll = m.payroll != null ? m.payroll : (m.pl.sal_rnd || 0) + (m.pl.sal_sm || 0) + (m.pl.sal_ga || 0) + (m.pl.benefits || 0) + (m.pl.culture || 0) + (state.industry === 'fnb' ? 0 : (m.pl.cogs_staff || 0));
        R0 += m.p.rev - side - once; V0 += variable; Fx += Math.max(0, cash - variable - payroll);
      });
      rev0 = R0 / hm.length; varR = R0 > 0 ? U.clamp(V0 / R0, 0, 1.5) : 0; fixed0 = Fx / hm.length; side0 = C0 / hm.length;
    } else fixed0 = Math.max(0, EN.forecastMonthlyCost(state) - RW.Team.monthlyCost(state));
    var g = opt.g != null ? opt.g : U.clamp(Math.round((state.kpi.cmgr3 || 0) * 100) / 100, -0.05, 0.15);
    var cut = opt.cut || 0, cash = state.fin.bal.cash, out = [], zeroAt = null, beAt = null;
    var info = T.info(w), m0 = info.monthsElapsed;
    var loans = state.fin.loans.map(function (l) { return { kind: l.kind, bal: l.balance + (l.feeLeft || 0), pay: l.payment || 0, rate: l.rate, io: l.interestOnly, age: Math.floor((w - l.startW) / 4.33), months: l.months, share: l.revShare }; });
    for (var i = 1; i <= 12; i++) {
      var atW = w + i * 4.33;
      var rev = rev0 * Math.pow(1 + g, i);
      var payroll = 0;
      RW.Team.all(state).forEach(function (e) { if (e.startW <= atW && !(opt.freeze && e.startW > w)) payroll += empCost(e.salary); });
      (state.cofounders || []).forEach(function (c) { if (c.active) payroll += c.salary + L.socialSecurity(c.salary); });
      payroll += state.founder.salary + (state.founder.salary > 0 ? L.socialSecurity(state.founder.salary) : 0);
      if (opt.hires && i >= 2) payroll += opt.hires * empCost(opt.salary || 35000);
      var debt = 0;
      loans.forEach(function (l) {
        if (l.kind === 'founder' || l.bal <= 1) return;
        var pay = l.kind === 'rbf' ? Math.min(l.bal, rev * l.share) : (l.age + i <= l.io ? l.bal * l.rate / 12 : Math.min(l.bal * (1 + l.rate / 12), l.pay));
        if (l.kind !== 'rbf' && l.age + i > l.io) l.bal -= Math.max(0, pay - l.bal * l.rate / 12); else if (l.kind === 'rbf') l.bal -= pay;
        debt += pay;
      });
      var cost = rev * varR + payroll + fixed0 * (1 - cut);
      var net = rev * collect + side0 - cost - debt;
      cash += net;
      out.push({ i: i, label: T.monthLabel(m0 + i - 1), rev: rev, inflow: rev * collect + side0, cost: cost, debt: debt, net: net, cash: cash });
      if (zeroAt == null && cash < 0) zeroAt = i;
      if (beAt == null && rev + side0 - cost >= 0 && rev + side0 > 0) beAt = i;
    }
    return { months: out, zeroAt: zeroAt, breakEven: beAt, g: g, base: { rev: rev0, side: side0, varR: varR, fixed: fixed0, collect: collect } };
  };

  // Paul Graham's "default alive": with current expenses and growth, profitable before cash runs out?
  EN.defaultAlive = function (state) {
    var hm = state.hist.monthly;
    if (hm.length < 3) return null;
    var last = hm[hm.length - 1];
    var rev = last.p.rev + (last.pl.rev_oneoff || 0); // one-off deals don't keep a company alive
    var exp = rev + Math.max(0, state.kpi.burn || 0);
    if (state.kpi.burn <= 0) return { alive: true, months: 0 };
    if (rev < 30000) return { alive: false, months: 0, tooEarly: true };
    // growth on a tiny base is noise: be conservative
    var g = U.clamp(state.kpi.cmgr3 || 0, -0.1, rev < 300000 ? 0.08 : 0.15);
    var cash = state.fin.bal.cash;
    for (var m = 1; m <= 72; m++) {
      rev *= 1 + g;
      exp *= 1.004;
      cash += rev - exp;
      if (rev >= exp) return { alive: true, months: m };
      if (cash < 0) return { alive: false, months: m };
    }
    return { alive: false, months: 72 };
  };

  // ---------- Solvency / game over ----------
  EN.checkSolvency = function (state, info) {
    var fin = state.fin;
    if (fin.bal.cash + fin.creditLine < 0) {
      fin.unpaid.weeksNeg++;
      if (fin.unpaid.weeksNeg === 1) EN.mail(state, 'finance', 'เงินสดติดลบ!', 'บริษัทไม่มีเงินพอจ่ายภาระ ค่าใช้จ่ายค้างชำระกำลังพอกพูน เจ้าหนี้เริ่มโทรตาม คุณมีเวลาไม่กี่สัปดาห์ก่อนต้องปิดกิจการ — ระดมทุน กู้ เอาเงินส่วนตัวใส่ ลดคน หรือขายบริษัท', 'bad');
      if (fin.unpaid.weeksNeg >= 6) EN.gameOver(state, 'bankrupt', 'เงินสดติดลบต่อเนื่อง 6 สัปดาห์ เจ้าหนี้ยื่นฟ้องล้มละลาย บริษัทต้องปิดกิจการ');
    } else fin.unpaid.weeksNeg = 0;
    var f = state.founder;
    if (f.cash < -Math.max(600000, f.burn * 10)) EN.gameOver(state, 'personal', 'หนี้ส่วนตัวพอกพูนจนคุณไม่สามารถทำบริษัทต่อได้ ต้องกลับไปหางานประจำเพื่อใช้หนี้');
  };

  EN.founderLoan = function (state) {
    return U.sum(state.fin.loans.filter(function (l) { return l.kind === 'founder'; }), function (l) { return l.balance; });
  };

  EN.gameOver = function (state, reason, text) {
    if (state.over) return;
    var M = RW.Models[state.industry];
    var equityValue = 0;
    if (reason === 'bankrupt') {
      // SME loans carry the director's personal guarantee: the bank recovers what liquidation does not cover
      var guaranteed = U.sum(state.fin.loans.filter(function (l) { return l.kind === 'bank'; }), function (l) { return l.balance; });
      if (guaranteed > 0) {
        var callOn = Math.round(guaranteed * 0.55);
        state.founder.cash -= callOn;
        state.stats.guaranteeCalled = callOn;
        text += ' — ธนาคารเรียกให้คุณชำระหนี้ตามสัญญาค้ำประกันส่วนตัว ' + F.m(callOn);
      }
    }
    if (reason === 'fired' || reason === 'timeup') {
      var v = Math.max(M.valuation(state) * RW.Funding.climate(state), 0);
      var wf = RW.Funding.waterfall(state, v);
      equityValue = wf.founder * (reason === 'timeup' ? 0.6 : 0.45); // illiquid private shares
    }
    if (reason === 'quit' && state.kpi.revenueMonthly > 0) {
      equityValue = 0;
    }
    state.over = { reason: reason, text: text, w: state.time.w, equity: equityValue, personal: state.founder.cash, wealth: state.founder.cash + equityValue };
    EN.finalize(state);
  };

  EN.maxW = function (state) { return state.maxW || RW.MAX_WEEKS; };
  EN.timeUp = function (state) {
    EN.gameOver(state, 'timeup', 'ครบ ' + Math.round(EN.maxW(state) / 52) + ' ปีของการเดินทาง — มาดูกันว่าคุณสร้างอะไรไว้');
  };

  EN.exit = function (state, kind, offer) {
    var wf = RW.Funding.waterfall(state, offer.price);
    var founderGross = wf.founder;
    var cash = founderGross * offer.cash;
    var stock = founderGross * (1 - offer.cash) * 0.8;
    // earn-out portion is uncertain: count half of it
    var proceeds = cash + stock - (offer.earnout ? founderGross * offer.earnout * 0.5 : 0);
    // buyer settles the company's debts at closing, including the founder's shareholder loan
    var loanBack = EN.founderLoan(state);
    state.founder.cash += proceeds + loanBack;
    state.over = { reason: kind, text: 'ขายกิจการให้ ' + offer.buyer + ' มูลค่า ' + F.m(offer.price) + (loanBack > 0 ? ' (ได้เงินกู้ผู้ก่อตั้งคืน ' + F.m(loanBack) + ')' : ''), w: state.time.w, price: offer.price, waterfall: wf, equity: proceeds, personal: state.founder.cash - proceeds, wealth: state.founder.cash, buyer: offer.buyer, offerKind: offer.kind, earnout: offer.earnout || 0 };
    state.achievements.exit = state.time.w;
    EN.finalize(state);
  };

  EN.ipoCheck = function (state) {
    var k = state.kpi;
    var hm = state.hist.monthly;
    var ni12 = U.sum(U.last(hm, 12), function (m) { return m.p.ni; });
    var ni24 = U.sum(U.last(hm, 24), function (m) { return m.p.ni; });
    var age = state.time.w / 52;
    var hasCFO = RW.Team.active(state).some(function (e) { return e.role === 'finance' && e.level >= 5; });
    var reqs = [
      { t: 'ดำเนินธุรกิจมาแล้วอย่างน้อย 3 ปี', ok: age >= 3 },
      { t: 'มี CFO ระดับผู้บริหาร', ok: hasCFO },
      { t: 'ผู้สอบบัญชี Big4 อย่างน้อย 1 ปี', ok: state.flags.auditor === 'big4' && state.time.w - (state.flags.auditorW || 0) > 52 },
      { t: 'รายได้ 12 เดือนล่าสุด ≥ ฿300M', ok: k.revenueTTM >= 300e6 },
      { t: 'กำไรสุทธิ 12 เดือนล่าสุด ≥ ฿30M และ 2 ปีรวม ≥ ฿50M (เกณฑ์ mai/SET แบบย่อ) หรือรายได้เติบโต > 40% ต่อปีพร้อมรายได้ ≥ ฿1,500M (IPO ต่างประเทศ)', ok: (ni12 >= 30e6 && ni24 >= 50e6) || (k.revenueTTM >= 1.5e9 && (k.yoyGrowth || 0) > 0.4) },
      { t: 'ตลาดทุนเปิด (VC/ตลาดหุ้นไม่อยู่ในช่วงซบเซา)', ok: state.world.vc >= 0.8 }
    ];
    return { ok: reqs.every(function (r) { return r.ok; }), reqs: reqs };
  };

  EN.startIPO = function (state) {
    var c = EN.ipoCheck(state);
    if (!c.ok || state.flags.ipo) return false;
    var fee = 15e6;
    L.spend(state.fin, 'prof', fee);
    state.flags.ipo = { w: state.time.w + 40, startW: state.time.w };
    EN.mail(state, 'funding', 'เริ่มกระบวนการ IPO', 'แต่งตั้งที่ปรึกษาทางการเงินและผู้จัดจำหน่ายหลักทรัพย์ ปรับโครงสร้างบริษัท ยื่นไฟลิ่งต่อ ก.ล.ต. ใช้เวลาประมาณ 9-10 เดือน ค่าใช้จ่ายเบื้องต้น ' + F.m(fee), 'good');
    return true;
  };

  EN.completeIPO = function (state) {
    var M = RW.Models[state.industry];
    state.flags.ipo = null;
    if (state.world.vc < 0.7) {
      EN.mail(state, 'funding', 'เลื่อน IPO — ตลาดไม่เอื้อ', 'ตลาดทุนผันผวนหนัก ผู้จัดจำหน่ายแนะนำให้เลื่อนออกไป ค่าใช้จ่ายที่จ่ายไปแล้วไม่ได้คืน', 'bad');
      return;
    }
    var v = M.valuation(state) * RW.Funding.climate(state) * R.range(0.9, 1.25);
    var raise = v * 0.25;
    var fd = RW.Funding.fullyDiluted(state);
    // IPO: all preferred convert to common; new shares issued
    var founderStake = RW.Funding.founderShares(state) / fd * (v / (v + raise));
    var value = founderStake * (v + raise) * 0.85; // lock-up discount
    state.founder.cash += EN.founderLoan(state); // repaid from IPO proceeds
    state.over = { reason: 'ipo', text: 'เข้าตลาดหลักทรัพย์สำเร็จ! มูลค่าตลาด ' + F.m(v + raise), w: state.time.w, price: v + raise, equity: value, personal: state.founder.cash, wealth: state.founder.cash + value };
    state.achievements.ipo = state.time.w;
    EN.finalize(state);
  };

  EN.RANKS = [
    [-Infinity, 'ล้มละลาย', 'คุณสูญเสียมากกว่าที่ลงไป บทเรียนนี้แพงที่สุดในชีวิต'],
    [500000, 'บทเรียนราคาแพง', 'เงินเก็บแทบหมด แต่คุณได้ประสบการณ์ที่หาซื้อไม่ได้'],
    [5e6, 'ผู้รอดชีวิต', 'ไม่รวย แต่ไม่จน และพร้อมลุยใหม่'],
    [30e6, 'ผู้ประกอบการตัวจริง', 'คุณสร้างธุรกิจที่มีคุณค่าได้จริง'],
    [150e6, 'เศรษฐีใหม่', 'ความเสี่ยงของคุณคุ้มค่า'],
    [1e9, 'ผู้ก่อตั้งพันล้าน', 'คุณอยู่ในกลุ่มผู้ก่อตั้งไม่กี่สิบคนของประเทศที่ทำได้ระดับนี้'],
    [10e9, 'ตำนานสตาร์ทอัพไทย', 'ชื่อคุณจะถูกพูดถึงในวงการไปอีกหลายสิบปี']
  ];
  EN.rank = function (wealth) {
    var r = EN.RANKS[0];
    EN.RANKS.forEach(function (x) { if (wealth >= x[0]) r = x; });
    return { title: r[1], desc: r[2] };
  };

  EN.finalize = function (state) {
    var o = state.over;
    o.rank = EN.rank(o.wealth);
    o.years = (o.w / 52).toFixed(1);
    o.peakHC = state.stats.peakHC;
    o.raised = state.stats.raised;
    o.maxRev = state.stats.maxRevenueMonth;
    var a = state.achievements, w = state.time.w;
    if (state.challenge === 'bootstrap' && o.wealth >= 30e6 && !state.stats.raised) a.ch_bootstrap = w;
    if (state.challenge === 'sprint' && o.wealth >= 100e6) a.ch_sprint = w;
    o.challenge = state.challenge || 'none';
    o.epilogue = EN.epilogue(state);
    EN.mail(state, 'system', 'จบเกม: ' + o.rank.title, o.text, 'info');
  };

  // ---------- Epilogue: what happened next ----------
  EN.epilogue = function (state) {
    var o = state.over, k = state.kpi, f = state.founder, M = RW.Models[state.industry];
    var name = state.company.name, yrs = o.w / 52, hc = RW.Team.headcount(state), peak = state.stats.peakHC || 0;
    var cust = Math.round(k.customers || 0), revM = k.revenueMonthly || 0, maxRev = state.stats.maxRevenueMonth || 0;
    var seedN = Math.abs(state.seed | 0);
    function pick(arr, salt) { return arr[(seedN + (salt || 0)) % arr.length]; }
    var ind = state.industry, b = state.biz, out = [];
    var branches = ind === 'fnb' ? b.branches.filter(function (x) { return x.state !== 'closed'; }).length : 0;
    var floor = ind === 'fnb' ? U.sum(b.branches.filter(function (x) { return x.state !== 'closed'; }), function (x) { return x.staff || 0; }) : 0;
    hc += floor; peak = Math.max(peak, hc);
    var profitable = (k.ebitdaTTM || 0) > 0, growth = k.yoyGrowth || 0;
    var yearsTxt = yrs < 1 ? Math.max(1, Math.round(o.w / 4.33)) + ' เดือน' : yrs.toFixed(1) + ' ปี';
    var wfH = o.waterfall ? o.waterfall.holders : null;
    var esop = wfH ? U.sum(wfH.filter(function (x) { return x.kind === 'employee'; }), function (x) { return x.amount; }) : 0;
    var invIn = U.sum(state.funding.holders.filter(function (x) { return x.kind === 'investor'; }), function (x) { return x.invested || 0; }) + U.sum(state.funding.safes, function (x) { return x.amount; });
    var invOut = wfH ? U.sum(wfH.filter(function (x) { return x.kind === 'investor'; }), function (x) { return x.amount; }) : 0;

    // 1) the company
    var co;
    switch (o.reason) {
      case 'bankrupt':
        co = name + ' ปิดตัวลงหลังดำเนินกิจการ ' + yearsTxt + ' ผู้ชำระบัญชีขายทรัพย์สินที่เหลือ' +
          (ind === 'saas' ? (cust > 0 ? ' ลูกค้า ' + F.num(cust) + ' รายได้รับอีเมลแจ้งปิดระบบล่วงหน้า 30 วันพร้อมไฟล์ข้อมูลของตัวเอง' : '') + ' โค้ดทั้งหมดถูกขายให้บริษัทซอฟต์แวร์รายหนึ่งในราคาไม่ถึงค่าเซิร์ฟเวอร์หนึ่งเดือน' :
            ind === 'ecom' ? ' สต็อกที่เหลือถูกขายเหมาให้พ่อค้าคนกลางในราคาราว 20% ของทุน หน้าร้านออนไลน์ถูกปิด' + (maxRev > 1e6 ? ' รีวิวห้าดาวหลายพันรายการหายไปพร้อมกับร้าน' : '') :
              ' อุปกรณ์ครัวถูกขายต่อให้ร้านเปิดใหม่ในราคาเศษเหล็ก ป้ายหน้าร้านถูกปลดลง ไม่กี่เดือนต่อมามีร้านใหม่มาเช่าทำเลเดิม') +
          (maxRev > 2.5e6 ? ' — คนในวงการหลายคนยังพูดถึงว่ามันเกือบไปได้แล้ว' : '');
        break;
      case 'personal':
        co = 'คุณกลับไปทำงานประจำเพื่อใช้หนี้ ' + (revM > 300000 && hc > 0 ? 'ทีมที่เหลือพยายามประคอง ' + name + ' ต่ออีกพักหนึ่ง แต่บริษัทที่ไม่มีผู้ก่อตั้งคอยผลักดันก็ค่อยๆ หยุดเติบโต' : name + ' ค่อยๆ เงียบหายไป เว็บไซต์ยังออนไลน์อยู่อีกปีหนึ่งจนโดเมนหมดอายุ');
        break;
      case 'fired':
        co = 'บอร์ดแต่งตั้ง CEO มืออาชีพจากภายนอก ' + pick(['ซึ่งตัดโปรเจกต์ที่คุณรักออกไปครึ่งหนึ่งภายใน 100 วันแรก', 'ซึ่งย้ายสำนักงานและเปลี่ยนวัฒนธรรมองค์กรจนคนรุ่นแรกแทบจำไม่ได้', 'ซึ่งโฟกัสกำไรมากกว่าการเติบโต บริษัทนิ่งขึ้นแต่ไม่ตื่นเต้นอีกต่อไป']) +
          ' คุณยังถือหุ้นสามัญอยู่ แต่ไม่มีเสียงในการตัดสินใจอีกแล้ว';
        break;
      case 'quit':
        co = 'คุณตัดสินใจเดินจาก ' + name + ' มา ' + (revM > 0 ? 'ลูกค้าที่เหลือถูกส่งต่อให้คู่แข่ง ' : '') + 'สิ่งที่สร้างไว้กลายเป็นแค่หนึ่งบรรทัดใน LinkedIn ของคุณ';
        break;
      case 'shutdown':
        co = 'คุณปิด ' + name + ' อย่างเป็นระเบียบ จ่ายค่าชดเชยครบทุกคน ชำระหนี้ทุกบาท และส่งอีเมลขอบคุณลูกค้าด้วยตัวเอง — คนในวงการจดจำว่าคุณปิดบริษัทอย่างรับผิดชอบ ซึ่งหายากกว่าที่คิด และนั่นจะทำให้การเริ่มครั้งหน้าง่ายขึ้นมาก';
        break;
      case 'acquired':
        co = (o.offerKind === 'acquihire' ? o.buyer + ' ซื้อ ' + name + ' เพื่อทีมงาน สินค้าถูกปิดภายในหกเดือน ทุกคนย้ายไปทำโปรเจกต์ใหม่ภายใต้แบรนด์ผู้ซื้อ' :
          o.offerKind === 'pe' ? o.buyer + ' เข้ามาบริหาร ' + name + ' แบบเน้นกำไร ตัดต้นทุนทุกบรรทัด แล้ววางแผนขายต่อในอีก 4–5 ปี' :
            name + ' กลายเป็นหนึ่งในหน่วยธุรกิจของ ' + o.buyer + ' แบรนด์ยังอยู่ แต่การตัดสินใจทั้งหมดต้องผ่านสำนักงานใหญ่') +
          (o.earnout ? ' — เงื่อนไข earn-out ทำให้คุณต้องทำงานต่อให้ผู้ซื้ออีกสองปีเต็ม เป็นสองปีที่ยาวที่สุดในชีวิต' : '');
        break;
      case 'ipo':
        co = 'เช้าวันแรกของการซื้อขาย หุ้น ' + name + ' ' + pick(['เปิดสูงกว่าราคาจองเกือบ 30%', 'ยืนเหนือราคาจองได้อย่างหวุดหวิด', 'ผันผวนตลอดวันก่อนปิดบวกเล็กน้อย']) + ' คุณกับทีมรุ่นแรกยืนเคาะระฆังด้วยกัน จากนี้ทุกไตรมาสคือการสอบต่อหน้านักลงทุนรายย่อยนับหมื่นคน';
        break;
      default:
        if (profitable && growth > 0.2) co = 'ครบ ' + Math.round(yrs) + ' ปี ' + name + ' ยังโตแรงและมีกำไร ' + (ind === 'fnb' ? 'มี ' + branches + ' สาขา ' : '') + 'นักลงทุนและผู้ซื้อกิจการเริ่มเข้ามาเคาะประตูบ่อยขึ้น เกมจริงอาจเพิ่งเริ่มต้น';
        else if (profitable) co = 'ครบ ' + Math.round(yrs) + ' ปี ' + name + ' กลายเป็นธุรกิจที่มั่นคงและมีกำไร ไม่หวือหวาแต่จ่ายเงินเดือนทุกคนตรงเวลาทุกเดือน — สิ่งที่สตาร์ทอัพส่วนใหญ่ไม่เคยทำได้';
        else if ((k.runway || 0) < 6) co = 'ครบ ' + Math.round(yrs) + ' ปี ' + name + ' ยังมีลมหายใจ แต่เงินสดเหลืออีกไม่กี่เดือน ทุกคนรู้ดีว่าปีหน้าคือปีตัดสิน';
        else co = 'ครบ ' + Math.round(yrs) + ' ปี ' + name + ' ยังไม่ทำกำไร และการเติบโตก็ช้าลง ภาษาวงการเรียกว่า "บริษัทซอมบี้" — ไม่ตาย แต่ก็ไม่โต';
    }
    out.push({ h: 'บริษัท', t: co });

    // 2) the team
    var team;
    if (peak === 0) team = 'คุณทำทุกอย่างด้วยตัวเองมาตลอด ไม่เคยต้องจ่ายเงินเดือนใคร และไม่เคยต้องบอกใครว่าบริษัทไม่มีเงิน';
    else if (o.reason === 'bankrupt') team = (hc > 0 ? 'พนักงาน ' + hc + ' คนสุดท้ายต้องหางานใหม่' + (state.stats.missedPayroll ? ' บางคนยังได้เงินเดือนเดือนสุดท้ายไม่ครบและต้องยื่นเรื่องต่อพนักงานตรวจแรงงาน' : ' ส่วนใหญ่ได้งานใหม่ภายในไม่กี่เดือน') : 'ทีมทยอยลาออกไปก่อนหน้านั้น คนสุดท้ายที่อยู่จนวันปิดคือตัวคุณเอง') + (peak >= 10 ? ' หลายคนยังเรียกช่วงเวลาที่ ' + name + ' ว่า "โรงเรียนที่แพงที่สุด"' : '');
    else if (esop > 1e5) team = 'พนักงานที่ถือ ESOP ได้รับเงินรวม ' + F.m(esop) + ' — บางคนเอาไปดาวน์บ้านหลังแรก บางคนเอาไปเริ่มบริษัทของตัวเอง';
    else team = 'ตลอดเส้นทางมีคนเคยทำงานกับคุณสูงสุด ' + peak + ' คนพร้อมกัน' + (state.stats.layoffs ? ' และคุณเคยต้องเลิกจ้าง ' + state.stats.layoffs + ' คน — ทุกครั้งยังจำหน้าได้' : '');
    if (peak >= 12) team += ' · ศิษย์เก่าอย่างน้อย ' + (Math.floor(peak / 12) + 1) + ' คนออกไปเปิดบริษัทของตัวเองในภายหลัง';
    var cofLeft = (state.cofounders || []).filter(function (c) { return !c.active; });
    if (cofLeft.length) team += ' · ' + cofLeft[0].nick + ' ผู้ร่วมก่อตั้งที่แยกทางกันไป ' + pick(['ส่งข้อความมาแสดงความยินดี/ให้กำลังใจ', 'ยังไม่ได้คุยกับคุณอีกเลย', 'กลายเป็นเพื่อนกันอีกครั้งหลังผ่านไปหลายปี'], 3);
    out.push({ h: 'ทีม', t: team });

    // 3) the investors
    if (invIn > 0) {
      var inv;
      if (o.reason === 'acquired') {
        var mult = invOut / invIn;
        inv = 'นักลงทุนลงเงินรวม ' + F.m(invIn) + ' ได้คืน ' + F.m(invOut) + ' (' + mult.toFixed(1) + 'x) ' + (mult >= 5 ? '— ดีลนี้จะถูกใช้เป็นตัวอย่างในพิตช์ระดมทุนกองต่อไปของพวกเขา' : mult >= 1 ? '— ไม่เลวร้าย แต่ไม่ใช่ผลตอบแทนที่ VC ฝันไว้' : '— ขาดทุน แต่ liquidation preference ช่วยให้ได้เงินคืนก่อนผู้ก่อตั้ง');
      } else if (o.reason === 'ipo') inv = 'นักลงทุนทุกรอบได้ผลตอบแทนหลายเท่าบนกระดาษ หลังพ้น lock-up หลายรายทยอยขายหุ้นออก';
      else if (o.reason === 'bankrupt' || o.reason === 'personal' || o.reason === 'quit') inv = 'เงินลงทุน ' + F.m(invIn) + ' ถูกตัดเป็นศูนย์ ' + (state.funding.board.confidence >= 50 ? 'นักลงทุนรายหนึ่งส่งข้อความว่า "ขอบคุณที่สู้จนวินาทีสุดท้าย ถ้าเปิดบริษัทใหม่ บอกผมเป็นคนแรก"' : 'บางรายไม่ตอบข้อความคุณอีกเลย');
      else inv = 'นักลงทุนที่ลงเงินรวม ' + F.m(invIn) + ' ยังรอการ exit ที่จะทำให้ตัวเลขในพอร์ตเป็นจริง';
      out.push({ h: 'นักลงทุน', t: inv });
    }

    // 4) the founder
    var me = [];
    if (f.health < 45) me.push('ร่างกายคุณใช้เวลาเกือบปีกว่าจะฟื้นตัวจากปีที่ทำงานหนัก');
    else if (state.achievements.burnout) me.push('อาการหมดไฟที่เคยเป็นสอนให้คุณรู้ขีดจำกัดของตัวเอง');
    if (f.life < 35) me.push('ความสัมพันธ์กับครอบครัวและคนใกล้ตัวต้องใช้เวลาซ่อมแซมนานกว่าบริษัทไหนๆ');
    else if (f.life >= 65) me.push(pick(['คนที่คุณรักยังอยู่ข้างคุณตลอดทาง', 'คุณยังมีเวลาให้ครอบครัวแม้ในปีที่หนักที่สุด และนั่นคือสิ่งที่คุณภูมิใจที่สุด', 'เพื่อนเก่ายังนัดกินข้าวกับคุณเหมือนเดิม ไม่มีใครถามเรื่อง valuation'], 5));
    if (state.stats.guaranteeCalled) me.push('หนี้ค้ำประกันธนาคาร ' + F.m(state.stats.guaranteeCalled) + ' จะตามคุณไปอีกหลายปี');
    me.push('ความมั่งคั่งสุทธิตอนจบ ' + F.m(o.wealth) + ' — ' + o.rank.desc);
    out.push({ h: 'ตัวคุณ', t: me.join(' · ') });

    // 5) the lesson
    var lesson;
    var payrollHeavy = peak >= 6 && maxRev < peak * 60000;
    if (o.reason === 'bankrupt' && maxRev < 150000) lesson = 'บริษัทส่วนใหญ่ไม่ได้ตายเพราะคู่แข่ง แต่ตายเพราะสร้างสิ่งที่คนไม่ยอมจ่ายเงินซื้อ — หาลูกค้าที่ยอมจ่ายจริงให้เร็วกว่านี้ แล้วค่อยขยาย';
    else if ((o.reason === 'bankrupt' || o.reason === 'fired') && payrollHeavy) lesson = 'ทีมโตเร็วกว่ารายได้ การจ้างหนึ่งคนคือการผูกเงินสดไว้ 12–18 เดือน — จ้างเมื่อคอขวดชัด ไม่ใช่เมื่อรู้สึกว่าควรโต';
    else if (o.reason === 'bankrupt' && state.stats.raised > 0) lesson = 'เงินหมดก่อนถึง milestone ถัดไป — เริ่มระดมทุนเมื่อยังเหลือ runway อย่างน้อย 9 เดือน และวางแผนให้ถึงเป้าหมายด้วยเงินแค่ 70% ของที่ระดมได้';
    else if (o.reason === 'bankrupt') lesson = 'กระแสเงินสดสำคัญกว่ากำไรบนกระดาษ — ดูเงินสดรายสัปดาห์ เก็บหนี้ให้เร็ว และอย่าใช้เงินที่ยังไม่ได้รับ';
    else if (o.reason === 'personal') lesson = 'ผู้ก่อตั้งก็มี runway ของตัวเอง เงินเดือนผู้ก่อตั้งที่พออยู่ได้ไม่ใช่ความฟุ่มเฟือย แต่คือสิ่งที่ทำให้บริษัทไม่ต้องจบเพราะคุณถังแตกก่อน';
    else if (o.reason === 'fired') lesson = 'เมื่อนักลงทุนคุมบอร์ด ความเชื่อมั่นคือสกุลเงินของคุณ — สัญญาให้น้อย ทำให้ได้มากกว่า และอย่าปล่อยให้บอร์ดได้ยินข่าวร้ายจากคนอื่น';
    else if (o.reason === 'acquired' || o.reason === 'ipo') lesson = 'จังหวะสำคัญพอๆ กับฝีมือ — คุณสร้างสิ่งที่คนอื่นยอมจ่ายเงินก้อนใหญ่เพื่อเป็นเจ้าของ และนั่นคือนิยามของการสร้างคุณค่า';
    else if (o.reason === 'shutdown') lesson = 'การรู้ว่าเมื่อไรควรหยุดคือทักษะของผู้ก่อตั้งที่ไม่มีใครสอน — คุณหยุดได้ก่อนที่มันจะทำร้ายคนรอบตัว';
    else if (profitable) lesson = 'ธุรกิจที่ดีคือธุรกิจที่ยังอยู่ ความอดทนและวินัยเรื่องเงินสดคือความได้เปรียบที่คนประเมินค่าต่ำที่สุด';
    else lesson = 'การอยู่รอดไม่เท่ากับการชนะ — ถ้ายังหา product-market fit ไม่เจอหลังหลายปี การเปลี่ยนทิศอย่างกล้าหาญอาจดีกว่าการประคองต่อ';
    out.push({ h: 'บทเรียน', t: lesson });
    return out;
  };

  // ---------- Achievements ----------
  EN.ACH = {
    registered: ['นิติบุคคลเต็มตัว', 'จดทะเบียนบริษัท'],
    first_customer: ['ลูกค้ารายแรก', 'มีคนยอมจ่ายเงินให้สิ่งที่คุณสร้าง'],
    first_hire: ['หัวหน้ามือใหม่', 'จ้างพนักงานคนแรก'],
    team10: ['ทีม 10 คน', 'มีพนักงาน 10 คน'],
    team50: ['บริษัทขนาดกลาง', 'มีพนักงาน 50 คน'],
    team200: ['องค์กรใหญ่', 'มีพนักงาน 200 คน'],
    rev1m: ['ล้านแรกต่อเดือน', 'รายได้เดือนละ ฿1M'],
    rev10m: ['สิบล้านต่อเดือน', 'รายได้เดือนละ ฿10M'],
    rev100m: ['ร้อยล้านต่อเดือน', 'รายได้เดือนละ ฿100M'],
    ramen: ['Ramen Profitable', 'กระแสเงินสดจากการดำเนินงานเป็นบวกทั้งเดือน'],
    default_alive: ['Default Alive', 'ด้วยการเติบโตปัจจุบัน บริษัทจะทำกำไรก่อนเงินหมด'],
    profitable_year: ['ปีแห่งกำไร', 'ปิดงบปีบัญชีมีกำไร'],
    raised_seed: ['ได้ทุน Seed', 'ปิดรอบ Seed สำเร็จ'],
    raised_A: ['Series A', 'ปิดรอบ Series A สำเร็จ'],
    raised_B: ['Series B', 'ปิดรอบ Series B สำเร็จ'],
    raised_C: ['Series C', 'ปิดรอบ Series C สำเร็จ'],
    unicorn: ['ยูนิคอร์น', 'มูลค่าบริษัทเกิน ฿35,000M (~US$1B)'],
    bootstrapped: ['ไม่ง้อ VC', 'รายได้ปีละ ฿100M โดยไม่เคยขายหุ้นให้นักลงทุน'],
    survived_recession: ['ฝ่าวิกฤต', 'ผ่านภาวะเศรษฐกิจถดถอยมาได้'],
    burnout: ['หมดไฟ', 'ร่างกายประท้วงครั้งแรก (ไม่ใช่สิ่งที่ควรภูมิใจ)'],
    missed_payroll: ['วันที่ทุกคนจำ', 'จ่ายเงินเดือนพนักงานไม่ได้'],
    exit: ['Exit!', 'ขายกิจการสำเร็จ'],
    ipo: ['ตีระฆัง', 'นำบริษัทเข้าตลาดหลักทรัพย์'],
    ch_bootstrap: ['ยืนด้วยขาตัวเอง', 'โหมด Bootstrap ล้วน: จบเกมด้วยความมั่งคั่ง ≥ ฿30M โดยไม่ขายหุ้นให้นักลงทุน'],
    ch_crisis: ['เกิดกลางพายุ', 'โหมดเริ่มกลางวิกฤต: บริษัทอยู่รอดครบ 3 ปี'],
    ch_sprint: ['วิ่งสุดแรง', 'โหมด Sprint 5 ปี: ความมั่งคั่ง ≥ ฿100M เมื่อจบเกม']
  };
  EN.checkAchievements = function (state) {
    var a = state.achievements, w = state.time.w, k = state.kpi;
    function set(id) { if (!a[id]) { a[id] = w; EN.mail(state, 'system', 'ปลดล็อกความสำเร็จ: ' + EN.ACH[id][0], EN.ACH[id][1], 'good'); } }
    if (state.company.registered) set('registered');
    if ((k.customers || 0) > 0) set('first_customer');
    var hc = RW.Team.headcount(state);
    if (hc >= 1 || (state.industry === 'fnb' && state.biz.branches.some(function (b) { return b.state === 'open'; }))) set('first_hire');
    if (hc >= 10) set('team10');
    if (hc >= 50) set('team50');
    if (hc >= 200) set('team200');
    if (k.revenueMonthly >= 1e6) set('rev1m');
    if (k.revenueMonthly >= 10e6) set('rev10m');
    if (k.revenueMonthly >= 100e6) set('rev100m');
    var hm = state.hist.monthly;
    if (hm.length && hm[hm.length - 1].cf.op + (hm[hm.length - 1].pl.rev_oneoff || 0) > 0 && hm[hm.length - 1].p.rev + (hm[hm.length - 1].pl.rev_oneoff || 0) > 50000) set('ramen');
    if (k.defaultAlive && k.defaultAlive.alive && k.burn > 0 && k.revenueMonthly > 100000 && k.runway > 6 && k.ebitdaMargin > -0.6) set('default_alive');
    ['seed', 'A', 'B', 'C'].forEach(function (s) { if (state.funding.rounds.some(function (r) { return r.stage === s; })) set('raised_' + s); });
    if (state.funding.lastPost >= 35e9) set('unicorn');
    if (state.challenge === 'crisis' && w >= 156) set('ch_crisis');
    if (k.revenueTTM >= 100e6 && state.funding.rounds.length === 0 && state.funding.safes.length === 0) set('bootstrapped');
    if (state.world.phase === 'recovery' && state.flags.sawRecession) set('survived_recession');
    if (state.world.phase === 'recession') state.flags.sawRecession = 1;
    if (state.founder.burnout > 0) set('burnout');
    if (state.stats.missedPayroll) set('missed_payroll');
  };

  // ---------- Advisor ----------
  EN.advice = function (state) {
    var out = [], k = state.kpi, f = state.founder;
    var M = RW.Models[state.industry];
    function add(lvl, t) { out.push({ lvl: lvl, t: t }); }
    if (!state.company.registered && !state.flags.registering) add('warn', 'ยังไม่ได้จดทะเบียนบริษัท — จ้างพนักงาน เก็บเงินลูกค้าองค์กร และระดมทุนไม่ได้จนกว่าจะจด (หน้า "บริษัท")');
    if (k.runway < 3) add('crit', 'Runway เหลือไม่ถึง 3 เดือน! การระดมทุนใช้เวลา 3-6 เดือน ต้องตัดสินใจเรื่องลดค่าใช้จ่ายทันที');
    else if (k.runway < 6 && !state.funding.raise) add('warn', 'Runway ต่ำกว่า 6 เดือน — ควรเริ่มระดมทุนหรือหาทางทำกำไรตั้งแต่ตอนนี้ (ระดมทุนมักใช้เวลา 3-6 เดือน)');
    if (state.fin.bal.cash < 0) add('crit', 'เงินสดติดลบ — ภายใน 6 สัปดาห์บริษัทจะล้มละลาย');
    var pr = RW.Team.payroll(state, T.info(state.time.w));
    var info = T.info(state.time.w);
    var weeksToEnd = info.weeksInMonth - info.weekOfMonth - 1;
    if (state.fin.bal.cash < pr.gross * 1.05 && pr.gross > 0) add('crit', 'เงินสดไม่พอจ่ายเงินเดือนสิ้นเดือนนี้ (' + F.b(pr.gross) + ') — ' + (weeksToEnd > 0 ? 'อีก ' + weeksToEnd + ' สัปดาห์' : 'สัปดาห์นี้!'));
    if (f.energy < 25) add('warn', 'พลังงานของคุณต่ำมาก เสี่ยงหมดไฟ — ลดชั่วโมงทำงานหรือลาพัก');
    if (f.cash < f.burn * 3) add('warn', 'เงินเก็บส่วนตัวของคุณเหลือไม่ถึง 3 เดือน — พิจารณาจ่ายเงินเดือนตัวเอง');
    if (k.morale != null && k.morale < 40) add('warn', 'ขวัญกำลังใจทีมต่ำ (' + Math.round(k.morale) + ') — คนเก่งจะเริ่มลาออก');
    var span = RW.Team.mgmtSpan(state), act = RW.Team.active(state).length;
    if (act > span * 1.1) add('warn', 'คนในทีม (' + act + ') มากเกินกว่าที่ผู้บริหารดูแลได้ (~' + Math.round(span) + ') — โปรโมตหรือจ้างหัวหน้าทีม ประสิทธิภาพกำลังลดลง');
    if (RW.Team.headcount(state) + 1 > RW.Team.officeCapacity(state)) add('warn', 'ออฟฟิศแน่นเกินไป — ย้ายที่ทำงานหรือเปลี่ยนเป็นไฮบริด/รีโมท');
    if (state.funding.board.confidence < 35 && state.funding.board.investorSeats > 0) add('warn', 'ความเชื่อมั่นของบอร์ดต่ำ (' + Math.round(state.funding.board.confidence) + ')');
    if (state.founder.salary === 0 && state.time.w > 26 && state.funding.rounds.length) add('info', 'หลังระดมทุน ผู้ก่อตั้งควรรับเงินเดือนพอประทังชีวิต นักลงทุนไม่อยากให้คุณถังแตก');
    (M.advice ? M.advice(state) : []).forEach(function (a) { out.push(a); });
    var order = { crit: 0, warn: 1, info: 2, good: 3 };
    out.sort(function (a, b) { return order[a.lvl] - order[b.lvl]; });
    return out;
  };
})(globalThis.RW = globalThis.RW || {});
