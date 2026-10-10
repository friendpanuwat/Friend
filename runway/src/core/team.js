/* RUNWAY — people: hiring pipeline, morale, stress, attrition, payroll, management capacity */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, L = RW.Ledger;
  var T = (RW.Team = {});

  var LEVEL_SKILL = [0, [28, 52], [45, 68], [58, 82], [66, 90], [70, 96]];
  var RAMP_WEEKS = [0, 12, 8, 7, 9, 12];
  var CHANNELS = {
    board: { n: 'ประกาศงาน (JobsDB/เว็บหางาน)', cost: 2500, flow: 0.7, quality: 0, d: 'ถูก ผู้สมัครเยอะแต่คุณภาพไม่แน่นอน' },
    linkedin: { n: 'LinkedIn Recruiter + Headhunt เอง', cost: 9000, flow: 1.0, quality: 4, d: 'เข้าถึงคนมีประสบการณ์ ต้องใช้เวลาคุณมาก' },
    agency: { n: 'บริษัทจัดหางาน (ค่าธรรมเนียม 20% ของเงินเดือนทั้งปี)', cost: 0, fee: 0.2, flow: 1.6, quality: 8, d: 'เร็วและคัดมาแล้ว แต่แพงมาก' },
    referral: { n: 'ให้พนักงานแนะนำ (โบนัส ฿20,000)', cost: 0, bonus: 20000, flow: 0.45, quality: 6, d: 'คนที่แนะนำมามักอยู่นานและเข้ากับทีม' }
  };
  T.CHANNELS = CHANNELS;

  T.init = function () {
    return {
      emps: [], openings: [], candidates: [], nextId: 1,
      mods: [],            // company-wide morale modifiers [{v, weeks, why}]
      policy: { benefits: 1, workmode: 0, hours: 0, culture: 1, bonusMonths: 1, esopPerHire: 0 },
      brand: 30,           // employer brand 0-100
      layoffsW: -999, history: { hired: 0, quit: 0, fired: 0, laidOff: 0 }
    };
  };

  T.active = function (state) { return state.team.emps.filter(function (e) { return e.startW <= state.time.w && !e.gone; }); };
  T.all = function (state) { return state.team.emps.filter(function (e) { return !e.gone; }); };
  T.headcount = function (state) { return T.all(state).length; };

  T.wageIndex = function (state) { return state.world ? state.world.wageIndex : 1; };

  T.marketSalary = function (state, role, level, skill) {
    var r = RW.ROLES[role];
    var base = r.salary[level];
    var band = LEVEL_SKILL[level];
    var mid = (band[0] + band[1]) / 2;
    var adj = 1 + U.clamp((skill - mid) / 60, -0.25, 0.35);
    return Math.round(base * adj * T.wageIndex(state) / 500) * 500;
  };

  T.genCandidate = function (state, op) {
    var ch = CHANNELS[op.channel];
    var band = LEVEL_SKILL[op.level];
    var skill = U.clamp(R.normal((band[0] + band[1]) / 2 + ch.quality * 0.6 + (state.team.brand - 40) / 12, (band[1] - band[0]) / 3.2), 15, 99);
    var traits = [];
    var tkeys = Object.keys(RW.TRAITS);
    var nTraits = R.chance(0.55) ? 1 : R.chance(0.35) ? 2 : 0;
    for (var i = 0; i < nTraits; i++) {
      var t = R.weighted(tkeys, function (k) {
        if (traits.indexOf(k) >= 0) return 0;
        var w = RW.TRAITS[k].hidden ? 0.8 : 1;
        if (op.channel === 'referral' && (k === 'toxic' || k === 'slacker' || k === 'jobhopper')) w *= 0.35;
        if (op.channel === 'agency' && k === 'jobhopper') w *= 1.6;
        if (k === 'rockstar') w *= skill > 75 ? 1.2 : 0.3;
        if (k === 'leader' && op.level < 3) w *= 0.3;
        return w;
      });
      if (t) traits.push(t);
    }
    var mkt = T.marketSalary(state, op.role, op.level, skill);
    // interview estimate error shrinks with hiring skill
    var hireSkill = T.interviewSkill(state);
    var errSd = U.lerp(16, 5, hireSkill);
    return {
      id: 'c' + (state.team.nextId++), name: RW.Names.person(), nick: RW.Names.nick(), role: op.role, level: op.level,
      skill: Math.round(skill), est: Math.round(U.clamp(skill + R.normal(0, errSd), 10, 99)), errSd: Math.round(errSd),
      traits: traits, ask: Math.round(mkt * R.range(0.95, 1.2) / 500) * 500,
      wantsEquity: op.level >= 3 && R.chance(0.5),
      opId: op.id, expires: state.time.w + R.int(2, 4), notice: op.level >= 2 && RW.ROLES[op.role].dept !== 'cogs' ? 4 : R.int(1, 2),
      interestBase: R.range(-0.4, 0.4)
    };
  };

  // How good the company is at judging candidates (0..1)
  T.interviewSkill = function (state) {
    var f = state.founder;
    var hr = T.capOf(state, 'hr');
    return U.clamp((f.skills.leadership - 20) / 120 + hr * 0.12 + (state.founder.focus.team || 0) / 200, 0.05, 0.95);
  };

  T.openPosition = function (state, role, level, channel) {
    var ch = CHANNELS[channel];
    var op = { id: 'o' + (state.team.nextId++), role: role, level: level, channel: channel, openedW: state.time.w };
    state.team.openings.push(op);
    if (ch.cost) L.spend(state.fin, 'recruit', ch.cost);
    return op;
  };

  T.closePosition = function (state, opId) {
    state.team.openings = state.team.openings.filter(function (o) { return o.id !== opId; });
    state.team.candidates = state.team.candidates.filter(function (c) { return c.opId !== opId; });
  };

  // Probability a candidate accepts an offer
  T.acceptProb = function (state, c, salary, equityPct) {
    var payRatio = salary / c.ask;
    var x = (payRatio - 1) * 9 + c.interestBase;
    x += (state.team.brand - 45) / 25;
    // stage credibility: funded companies are safer bets
    var stageIdx = RW.STAGE_ORDER.indexOf(state.funding.stage);
    x += stageIdx >= 0 ? (stageIdx + 1) * 0.18 : -0.3;
    var runway = state.kpi ? state.kpi.runway : 12;
    if (runway < 6) x -= (6 - runway) * 0.15;
    if (equityPct > 0) x += Math.min(1.2, equityPct * 100 * (c.wantsEquity ? 1.2 : 0.5));
    else if (c.wantsEquity) x -= 0.6;
    if (state.time.w - state.team.layoffsW < 26) x -= 0.5;
    x += (state.founder.skills.leadership - 50) / 60;
    return U.clamp(U.sigmoid(x), 0.02, 0.98);
  };

  T.makeOffer = function (state, candId, salary, equityShares) {
    var c = state.team.candidates.find(function (x) { return x.id === candId; });
    if (!c) return { ok: false, msg: 'ผู้สมัครไม่อยู่แล้ว' };
    var fd = RW.Funding.fullyDiluted(state);
    var pct = equityShares > 0 ? equityShares / fd : 0;
    var p = T.acceptProb(state, c, salary, pct);
    var r = R.f();
    if (r < p) {
      var e = T.hire(state, c, salary, equityShares);
      return { ok: true, emp: e, msg: c.name + ' ตอบรับข้อเสนอ เริ่มงานในอีก ' + c.notice + ' สัปดาห์' };
    }
    // maybe counter-offer
    if (r < p + 0.3 && salary < c.ask * 1.15) {
      c.ask = Math.round(Math.max(c.ask, salary * R.range(1.06, 1.15)) / 500) * 500;
      c.countered = true;
      return { ok: false, counter: true, msg: c.name + ' ขอต่อรองเงินเดือนเป็น ' + RW.F.b(c.ask) };
    }
    state.team.candidates = state.team.candidates.filter(function (x) { return x.id !== candId; });
    return { ok: false, msg: c.name + ' ปฏิเสธข้อเสนอ (' + R.pick(['ได้ข้อเสนอที่ดีกว่าจากบริษัทใหญ่', 'ไม่มั่นใจในความมั่นคงของบริษัท', 'ครอบครัวไม่อยากให้ย้ายไปสตาร์ทอัพ', 'เงินเดือนต่ำกว่าที่คาด']) + ')' };
  };

  T.hire = function (state, c, salary, equityShares) {
    var op = state.team.openings.find(function (o) { return o.id === c.opId; });
    var e = {
      id: 'e' + (state.team.nextId++), name: c.name, nick: c.nick, role: c.role, level: c.level,
      skill: c.skill, est: c.est, salary: salary, traits: c.traits.slice(), known: c.traits.filter(function (t) { return !RW.TRAITS[t].hidden; }),
      hiredW: state.time.w, startW: state.time.w + c.notice, ramp: 0, morale: 70, stress: 20,
      lastRaiseW: state.time.w, promoW: state.time.w, options: 0, gone: false, perf: 1
    };
    state.team.emps.push(e);
    if (equityShares > 0) RW.Funding.grantOptions(state, e, equityShares);
    if (op) {
      var ch = CHANNELS[op.channel];
      if (ch.fee) L.spend(state.fin, 'recruit', Math.round(salary * 12 * ch.fee));
      if (ch.bonus) L.spend(state.fin, 'recruit', ch.bonus);
      T.closePosition(state, op.id);
    }
    state.team.candidates = state.team.candidates.filter(function (x) { return x.id !== c.id; });
    state.team.history.hired++;
    // laptop etc.
    L.buyAsset(state, 'อุปกรณ์ทำงาน ' + c.name, RW.ROLES[c.role].dept === 'cogs' && state.industry === 'fnb' ? 3000 : 38000, 36);
    return e;
  };

  T.find = function (state, id) { return state.team.emps.find(function (e) { return e.id === id; }); };

  T.tenureWeeks = function (state, e) { return Math.max(0, state.time.w - e.startW); };

  T.severanceCost = function (state, e) {
    var days = L.severanceDays(T.tenureWeeks(state, e));
    var notice = e.startW > state.time.w ? 0 : e.salary; // pay in lieu of notice (one pay cycle)
    return Math.round(e.salary / 30 * days + notice);
  };

  // remove an employee; mode: 'fire' | 'layoff' | 'quit' | 'cancel'
  T.remove = function (state, e, mode) {
    e.gone = true; e.goneW = state.time.w; e.goneMode = mode;
    if (mode === 'fire' || mode === 'layoff') {
      var cost = T.severanceCost(state, e);
      if (cost > 0) L.spend(state.fin, 'severance', cost);
      state.team.history[mode === 'fire' ? 'fired' : 'laidOff']++;
    }
    if (mode === 'quit') state.team.history.quit++;
    RW.Funding.forfeitOptions(state, e);
    // knowledge loss hooks
    var M = RW.Models && RW.Models[state.industry];
    if (M && M.onEmployeeLeft) M.onEmployeeLeft(state, e, mode);
    // purge from storage after a while (keep for history)
    state.team.emps = state.team.emps.filter(function (x) { return !x.gone || state.time.w - x.goneW < 60; });
  };

  T.fire = function (state, id) {
    var e = T.find(state, id);
    if (!e || e.gone) return 0;
    var cost = T.severanceCost(state, e);
    T.remove(state, e, 'fire');
    var toxic = e.traits.indexOf('toxic') >= 0 && e.known.indexOf('toxic') >= 0;
    T.addMod(state, toxic ? 5 : -3, 8, toxic ? 'ทีมโล่งใจที่คนเป็นพิษออกไป' : 'เพื่อนร่วมงานถูกเลิกจ้าง');
    return cost;
  };

  T.layoff = function (state, ids) {
    var total = 0, n = 0;
    ids.forEach(function (id) {
      var e = T.find(state, id);
      if (e && !e.gone) { total += T.severanceCost(state, e); T.remove(state, e, 'layoff'); n++; }
    });
    if (n > 0) {
      var share = n / Math.max(1, T.headcount(state) + n);
      T.addMod(state, -Math.round(8 + share * 40), 26, 'เลย์ออฟ ' + n + ' คน — คนที่เหลือกลัวว่าจะเป็นรายต่อไป');
      state.team.layoffsW = state.time.w;
      state.team.brand = Math.max(0, state.team.brand - 6 - share * 30);
      state.founder.rep = Math.max(0, state.founder.rep - Math.min(8, n * 0.6));
    }
    return { cost: total, n: n };
  };

  T.giveRaise = function (state, id, pct) {
    var e = T.find(state, id);
    if (!e) return;
    e.salary = Math.round(e.salary * (1 + pct) / 500) * 500;
    e.morale = U.clamp(e.morale + pct * 120, 0, 100);
    e.lastRaiseW = state.time.w;
  };

  T.promote = function (state, id) {
    var e = T.find(state, id);
    if (!e || e.level >= 5) return false;
    e.level++;
    var mk = T.marketSalary(state, e.role, e.level, e.skill);
    e.salary = Math.max(Math.round(e.salary * 1.12 / 500) * 500, Math.round(mk * 0.95 / 500) * 500);
    e.morale = U.clamp(e.morale + 15, 0, 100);
    e.promoW = state.time.w; e.lastRaiseW = state.time.w;
    return true;
  };

  T.addMod = function (state, v, weeks, why) {
    state.team.mods.push({ v: v, weeks: weeks, total: weeks, why: why });
  };
  T.modTotal = function (state) {
    return U.sum(state.team.mods, function (m) { return m.v * (m.weeks / m.total); });
  };

  // ---------- Capacity ----------
  T.mgmtSpan = function (state) {
    var f = state.founder;
    var founderSpan = (4 + f.skills.leadership / 14) * (0.6 + (f.focus.team || 0) / 60) * RW.Founder.effectiveness(state);
    var span = founderSpan;
    T.active(state).forEach(function (e) {
      if (e.level >= 4) span += (e.level === 5 ? 8 : 6) * (e.traits.indexOf('leader') >= 0 ? 1.4 : 1) * e.ramp;
    });
    (state.cofounders || []).forEach(function (c) { if (c.active) span += 6; });
    return span;
  };

  T.mgmtEfficiency = function (state) {
    var n = T.active(state).length;
    if (n === 0) return 1;
    var span = T.mgmtSpan(state);
    var eff = n <= span ? 1 : Math.pow(span / n, 0.55);
    // communication overhead grows with size (Brooks)
    var comm = 1 - 0.035 * Math.log2(Math.max(1, n / 6));
    return U.clamp(eff * comm, 0.35, 1);
  };

  T.officeCapacity = function (state) {
    var o = state.company.office;
    var need = RW.POLICIES.workmode[state.team.policy.workmode].officeNeed;
    return Math.floor(o.seats / Math.max(0.1, need));
  };

  T.outputOf = function (state, e) {
    var pol = state.team.policy;
    var out = Math.pow(e.skill / 60, 1.3);
    out *= e.ramp;
    out *= 0.7 + 0.6 * e.morale / 100;
    e.traits.forEach(function (t) { if (RW.TRAITS[t].out) out *= RW.TRAITS[t].out; });
    out *= RW.POLICIES.hours[pol.hours].prod * RW.POLICIES.workmode[pol.workmode].prod;
    if (e.stress > 80) out *= 0.8;
    return out;
  };

  T.computeCaps = function (state) {
    var caps = {};
    var eff = T.mgmtEfficiency(state);
    var over = T.headcount(state) + 1 > T.officeCapacity(state) ? 0.88 : 1;
    T.active(state).forEach(function (e) {
      var r = RW.ROLES[e.role];
      var o = T.outputOf(state, e) * eff * over;
      e.lastOut = o;
      for (var k in r.cap) caps[k] = (caps[k] || 0) + o * r.cap[k];
      // executives boost their department
      if (e.level >= 4) caps['lead_' + e.role] = (caps['lead_' + e.role] || 0) + e.skill / 100 * e.ramp;
    });
    // co-founders behave like senior employees of their role
    (state.cofounders || []).forEach(function (c) {
      if (!c.active) return;
      var r = RW.ROLES[c.role];
      var o = Math.pow(c.skill / 60, 1.3) * (0.7 + 0.6 * c.morale / 100) * eff;
      for (var k in r.cap) caps[k] = (caps[k] || 0) + o * r.cap[k];
      caps['lead_' + c.role] = (caps['lead_' + c.role] || 0) + c.skill / 100;
    });
    // founder contributions
    var fc = RW.Founder.contribution(state);
    for (var k2 in fc) caps[k2] = (caps[k2] || 0) + fc[k2];
    caps.mgmtEff = eff;
    state.caps = caps;
    return caps;
  };
  T.capOf = function (state, k) { return (state.caps && state.caps[k]) || 0; };

  // ---------- Weekly update ----------
  T.weekly = function (state) {
    var w = state.time.w, team = state.team, pol = team.policy;
    // decay morale modifiers
    team.mods.forEach(function (m) { m.weeks--; });
    team.mods = team.mods.filter(function (m) { return m.weeks > 0; });

    // candidates for openings
    team.openings.forEach(function (op) {
      var ch = CHANNELS[op.channel];
      var lam = ch.flow * (0.6 + team.brand / 80) * (state.world ? state.world.talentSupply : 1) * (op.channel === 'linkedin' ? 0.6 + (state.founder.focus.team || 0) / 25 : 1);
      lam *= state.founder.bg ? RW.BACKGROUNDS[state.founder.bg].net.talent : 1;
      lam *= 1 + T.capOf(state, 'hr') * 0.35;
      if (op.level >= 4) lam *= 0.55;
      if (state.industry === 'fnb' && RW.ROLES[op.role].dept === 'cogs') lam *= 1.6;
      var n = R.poisson(lam);
      for (var i = 0; i < n; i++) team.candidates.push(T.genCandidate(state, op));
      if (op.channel === 'board' && (w - op.openedW) % 4 === 3) L.spend(state.fin, 'recruit', ch.cost); // job-board renewal
    });
    team.candidates = team.candidates.filter(function (c) { return c.expires >= w; });

    // employees
    var toxicCount = T.active(state).filter(function (e) { return e.traits.indexOf('toxic') >= 0; }).length;
    var hc = Math.max(1, T.active(state).length);
    var modT = T.modTotal(state);
    var momentum = state.kpi ? state.kpi.momentum || 0 : 0;
    var runway = state.kpi ? state.kpi.runway : 24;
    var eff = state.caps ? state.caps.mgmtEff || 1 : 1;
    var officeOver = T.headcount(state) + 1 > T.officeCapacity(state);
    var training = RW.POLICIES.culture[pol.culture].train || 1;
    var mentors = T.active(state).filter(function (e) { return e.traits.indexOf('mentor') >= 0; }).length;

    T.all(state).forEach(function (e) {
      if (e.startW > w) return;
      if (e.startW === w) {
        state.inbox && RW.Engine.mail(state, 'team', e.name + ' เริ่มงานวันแรก', RW.ROLES[e.role].n + ' (' + RW.LEVELS[e.level] + ') — ต้องใช้เวลาประมาณ ' + RAMP_WEEKS[e.level] + ' สัปดาห์จึงจะทำงานได้เต็มที่');
      }
      // ramp-up
      var rw = RAMP_WEEKS[e.level] * (T.capOf(state, 'hr') > 0.5 ? 0.85 : 1);
      e.ramp = Math.min(1, e.ramp + 1 / rw);
      // morale target
      var mk = T.marketSalary(state, e.role, e.level, e.skill);
      var target = 58;
      target += U.clamp((e.salary / mk - 1) * 60, -22, 14);
      target += RW.POLICIES.benefits[pol.benefits].morale + RW.POLICIES.culture[pol.culture].morale;
      target += RW.POLICIES.workmode[pol.workmode].morale + RW.POLICIES.hours[pol.hours].morale;
      target += RW.OFFICES[state.company.office.type].morale;
      target += U.clamp(momentum, -10, 10);
      if (runway < 3) target -= 14; else if (runway < 6) target -= 6;
      target += modT;
      target += (state.founder.skills.leadership - 50) / 6;
      if (eff < 0.8) target -= (0.8 - eff) * 30;
      if (officeOver) target -= 5;
      if (toxicCount > 0 && e.traits.indexOf('toxic') < 0) target -= Math.min(12, toxicCount * 30 / hc);
      if (e.stress > 55) target -= (e.stress - 55) / 3;
      var sinceRaise = w - e.lastRaiseW;
      if (sinceRaise > 78) target -= 6; else if (sinceRaise < 30) target += 2;
      if (e.traits.indexOf('ambitious') >= 0 && w - e.promoW > 80) target -= 8;
      if (e.options > 0) target += Math.min(6, 2 + RW.Funding.optionValue(state, e) / (e.salary * 24) * 6);
      if (state.flags.payrollMissed && w - state.flags.payrollMissed < 12) target -= 25;
      e.mtarget = U.clamp(target, 0, 100);
      e.morale = U.clamp(U.approach(e.morale, e.mtarget, 0.14) + R.normal(0, 0.8), 0, 100);
      // stress
      var st = RW.POLICIES.hours[pol.hours].stress * (e.traits.indexOf('hustler') >= 0 ? 1.6 : 1);
      var load = state.kpi && state.kpi.workload ? state.kpi.workload[RW.ROLES[e.role].dept] || 1 : 1;
      st += (load - 1) * 4;
      e.stress = U.clamp(e.stress + st - (e.stress > 30 ? 1.5 : 0.5), 0, 100);
      // skill growth
      var g = 0.045 * training * (1 + mentors * 0.25 / hc * 4) * (e.traits.indexOf('ambitious') >= 0 ? 1.6 : 1) * (1 - e.skill / 105);
      e.skill = Math.min(99, e.skill + g);
      // trait reveal
      if (w - e.startW > 6 && e.known.length < e.traits.length && R.chance(0.06)) {
        var hidden = e.traits.filter(function (t) { return e.known.indexOf(t) < 0; });
        var t = R.pick(hidden);
        e.known.push(t);
        RW.Engine.mail(state, 'team', 'คุณเริ่มรู้จัก ' + e.name + ' มากขึ้น', 'ลักษณะที่เพิ่งเห็นชัด: "' + RW.TRAITS[t].n + '" — ' + RW.TRAITS[t].d);
      }
      // estimate converges toward truth over time
      e.est = Math.round(U.approach(e.est, e.skill, 0.05));
      // attrition
      if (!e.leaving) {
        var annual = 0.11;
        var q = U.weeklyFromMonthly(annual / 12);
        q *= Math.exp((55 - e.morale) / 14);
        e.traits.forEach(function (tt) { if (RW.TRAITS[tt].quit) q *= RW.TRAITS[tt].quit; });
        q *= state.world ? state.world.poach : 1;
        if (e.skill > 75) q *= 1.25; // good people get poached
        if (e.stress > 85) q *= 1.8;
        if (w - e.startW < 13) q *= 1.3;
        if (R.chance(q)) T.resign(state, e);
      } else if (w >= e.leaveW) {
        RW.Engine.mail(state, 'team', e.name + ' พ้นสภาพพนักงานแล้ว', 'วันนี้เป็นวันทำงานวันสุดท้าย');
        T.remove(state, e, 'quit');
      }
    });

    // employer brand drifts toward fundamentals
    var brandTarget = 30 + RW.OFFICES[state.company.office.type].brand + RW.POLICIES.benefits[pol.benefits].hire * 100
      + Math.min(25, state.founder.rep / 3) + (RW.STAGE_ORDER.indexOf(state.funding.stage) + 1) * 5
      + (U.avg(T.active(state), function (e) { return e.morale; }) - 55) / 3;
    if (w - team.layoffsW < 52) brandTarget -= 12;
    team.brand = U.clamp(U.approach(team.brand, brandTarget, 0.03), 0, 100);
  };

  T.resign = function (state, e) {
    e.leaving = true;
    e.leaveW = state.time.w + (e.level >= 2 ? 4 : 2);
    var important = e.level >= 4 || e.skill >= 78 || (state.team.emps.length <= 6);
    if (important && RW.Events) {
      RW.Events.queue(state, 'counter_offer', { emp: e.id });
    } else {
      RW.Engine.mail(state, 'team', e.name + ' ยื่นใบลาออก', RW.ROLES[e.role].n + ' — ' + R.pick(['ได้งานใหม่เงินเดือนสูงกว่า 30%', 'อยากพักผ่อนหลังทำงานหนัก', 'ย้ายไปบริษัทต่างชาติ', 'ไม่เห็นอนาคตในบริษัท', 'กลับไปดูแลครอบครัวที่ต่างจังหวัด', 'ไปเรียนต่อต่างประเทศ']) + ' · ทำงานถึง ' + RW.T.label(e.leaveW), 'warn');
    }
  };

  // ---------- Payroll (month end) ----------
  T.payroll = function (state, info) {
    var fin = state.fin, w = state.time.w;
    var monthStartW = w - info.weekOfMonth;
    var tot = { rnd: 0, sm: 0, ga: 0, cogs: 0, sso: 0, benefit: 0, culture: 0 };
    var pol = state.team.policy;
    T.all(state).forEach(function (e) {
      if (e.startW > w) return;
      var weeks = Math.min(info.weeksInMonth, w - Math.max(e.startW, monthStartW) + 1);
      var frac = weeks / info.weeksInMonth;
      var pay = e.salary * frac;
      tot[RW.ROLES[e.role].dept] += pay;
      tot.sso += L.socialSecurity(e.salary) * frac;
      tot.benefit += RW.POLICIES.benefits[pol.benefits].cost * frac;
      tot.culture += RW.POLICIES.culture[pol.culture].cost * frac;
    });
    // gone employees this month: final pay
    state.team.emps.forEach(function (e) {
      if (e.gone && e.goneW >= monthStartW && e.goneW <= w && e.startW <= e.goneW) {
        var weeks = e.goneW - Math.max(e.startW, monthStartW);
        if (weeks > 0) tot[RW.ROLES[e.role].dept] += e.salary * weeks / info.weeksInMonth;
      }
    });
    (state.cofounders || []).forEach(function (c) {
      if (!c.active) return;
      tot.ga += c.salary; tot.sso += L.socialSecurity(c.salary);
    });
    // founder salary
    var fs = state.founder.salary;
    tot.ga += fs; if (fs > 0) tot.sso += L.socialSecurity(fs);
    var gross = tot.rnd + tot.sm + tot.ga + tot.cogs + tot.sso + tot.benefit + tot.culture;
    var cashNeeded = gross;
    return { tot: tot, gross: gross, cashNeeded: cashNeeded };
  };

  T.postPayroll = function (state, p) {
    var t = p.tot;
    L.post(state.fin, { sal_rnd: t.rnd, sal_sm: t.sm, sal_ga: t.ga, cogs_staff: t.cogs, benefits: t.sso + t.benefit, culture: t.culture, cash: -p.gross }, 'op');
  };

  T.monthlyCost = function (state) {
    var pol = state.team.policy;
    var s = 0;
    T.all(state).forEach(function (e) {
      s += e.salary + L.socialSecurity(e.salary) + RW.POLICIES.benefits[pol.benefits].cost + RW.POLICIES.culture[pol.culture].cost;
    });
    (state.cofounders || []).forEach(function (c) { if (c.active) s += c.salary + L.socialSecurity(c.salary); });
    s += state.founder.salary + (state.founder.salary > 0 ? L.socialSecurity(state.founder.salary) : 0);
    return s;
  };

  // Year-end bonus (13th month salary culture in Thailand)
  T.yearEndBonus = function (state) {
    var m = state.team.policy.bonusMonths;
    var emps = T.active(state).filter(function (e) { return state.time.w - e.startW > 13; });
    var total = U.sum(emps, function (e) { return e.salary * m; });
    if (total > 0) L.spend(state.fin, 'benefits', total);
    var v = m === 0 ? -10 : m < 1 ? -4 : m === 1 ? 2 : m === 1.5 ? 5 : 8;
    T.addMod(state, v, 10, m === 0 ? 'ไม่มีโบนัสปลายปี' : 'โบนัสปลายปี ' + m + ' เดือน');
    return total;
  };

  // Annual merit increases (January). Returns cost change per month.
  T.annualRaises = function (state, pct) {
    var before = T.monthlyCost(state);
    T.active(state).forEach(function (e) {
      if (pct > 0) { e.salary = Math.round(e.salary * (1 + pct) / 500) * 500; e.lastRaiseW = state.time.w; }
    });
    var expect = (state.world.wageIndexYoY || 1.04) - 1;
    T.addMod(state, Math.round((pct - expect) * 150), 12, pct > 0 ? 'ปรับเงินเดือนประจำปี ' + (pct * 100).toFixed(1) + '%' : 'ไม่มีการขึ้นเงินเดือนประจำปี');
    return T.monthlyCost(state) - before;
  };

  T.avgMorale = function (state) {
    var a = T.active(state);
    return a.length ? U.avg(a, function (e) { return e.morale; }) : null;
  };
})(globalThis.RW = globalThis.RW || {});
