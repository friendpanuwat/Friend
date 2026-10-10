/* RUNWAY — the founder: time allocation, energy, stress, skills, personal finances, co-founders */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U;
  var Fd = (RW.Founder = {});

  Fd.init = function (opt) {
    var bg = RW.BACKGROUNDS[opt.bg];
    return {
      name: opt.name || 'คุณ', bg: opt.bg, skills: U.deepCopy(bg.skills), xp: {},
      energy: 90, stress: 20, health: 95, life: 70, hours: 60,
      focus: { build: 45, sell: 20, market: 5, discover: 20, team: 0, fundraise: 0, admin: 10, consult: 0 },
      salary: 0, cash: bg.savings + (opt.extraCash || 0), burn: bg.burn, rep: bg.rep,
      vacation: 0, burnout: 0, weeksWorked: 0, personalDebt: 0
    };
  };

  Fd.effectiveness = function (state) {
    var f = state.founder;
    if (f.vacation > 0) return 0;
    var e = f.energy >= 50 ? 1 : 0.4 + 0.6 * f.energy / 50;
    if (f.burnout > 0) e *= 0.5;
    if (f.health < 40) e *= 0.75;
    return e;
  };

  // Founder's weekly contribution expressed in capacity units (≈ FTE equivalents)
  Fd.contribution = function (state) {
    var f = state.founder, out = {};
    var M = RW.Models[state.industry];
    var map = M.founderMap;
    var eff = Fd.effectiveness(state);
    var hoursF = Math.pow(f.hours / 45, 0.85); // diminishing returns from long hours
    for (var k in f.focus) {
      var share = (f.focus[k] || 0) / 100;
      if (share <= 0) continue;
      var sk = RW.FOCUS[k].skill === 'best' ? 60 : f.skills[RW.FOCUS[k].skill] || 40;
      var units = share * hoursF * Math.pow(sk / 60, 1.3) * eff;
      var m = map[k] || {};
      for (var c in m) out[c] = (out[c] || 0) + units * m[c];
      out['f_' + k] = units;
    }
    return out;
  };

  // weekly consulting income from founder's 'consult' time (paid on 30-day terms)
  Fd.consultIncome = function (state) {
    var f = state.founder;
    var share = (f.focus.consult || 0) / 100;
    if (share <= 0 || f.vacation > 0) return 0;
    var best = Math.max(f.skills.tech, f.skills.sales, f.skills.finance, f.skills.product);
    var units = share * Math.pow(f.hours / 45, 0.85) * Fd.effectiveness(state);
    var demand = state.world.macro.demand;
    return Math.round(units * 38000 * Math.pow(best / 60, 1.5) * demand * (0.6 + Math.min(0.6, f.rep / 60)));
  };

  Fd.setFocus = function (state, key, val) {
    var f = state.founder.focus;
    val = U.clamp(Math.round(val), 0, 100);
    var others = Object.keys(f).filter(function (k) { return k !== key; });
    var restOld = U.sum(others, function (k) { return f[k]; });
    var restNew = 100 - val;
    f[key] = val;
    if (restOld <= 0) {
      others.forEach(function (k, i) { f[k] = i === 0 ? restNew : 0; });
    } else {
      var acc = 0;
      others.forEach(function (k) { f[k] = Math.floor(f[k] * restNew / restOld); acc += f[k]; });
      // distribute rounding remainder to the largest
      var rem = restNew - acc;
      others.sort(function (a, b) { return f[b] - f[a]; });
      for (var i = 0; rem > 0; i = (i + 1) % others.length) { f[others[i]]++; rem--; }
    }
  };

  Fd.weekly = function (state) {
    var f = state.founder;
    if (f.vacation > 0) {
      f.vacation--;
      f.energy = U.clamp(f.energy + 14, 0, 100);
      f.stress = U.clamp(f.stress - 10, 0, 100);
      f.life = U.clamp(f.life + 4, 0, 100);
      if (f.burnout > 0) f.burnout = Math.max(0, f.burnout - 2);
      return;
    }
    f.weeksWorked++;
    // stress target from workload and company situation
    var runway = state.kpi ? state.kpi.runway : 24;
    var target = 18 + Math.max(0, f.hours - 45) * 0.75;
    if (runway < 3) target += 30; else if (runway < 6) target += 16; else if (runway < 9) target += 7;
    if (state.funding.raise) target += 8;
    if (state.funding.boardPressure) target += state.funding.boardPressure * 0.15;
    if (state.fin.unpaid.weeksNeg > 0) target += 20;
    target += (100 - f.life) * 0.12;
    target += Math.max(0, RW.Team.headcount(state) - RW.Team.mgmtSpan(state)) * 1.2;
    if (state.flags.crisis && state.time.w - state.flags.crisis < 4) target += 12;
    f.stress = U.clamp(U.approach(f.stress, target, 0.18) + R.normal(0, 1.2), 0, 100);
    // energy
    // ~60h/week is sustainable while stress is low; 70h+ grinds you down
    var net = 2.2 - Math.max(0, f.hours - 48) * 0.17 - Math.max(0, f.stress - 30) * 0.06 + (f.life - 60) * 0.02;
    f.energy = U.clamp(f.energy + net, 0, 100);
    // burnout
    if (f.burnout > 0) f.burnout--;
    if (f.energy < 12 && f.burnout === 0 && R.chance(0.25)) {
      f.burnout = R.int(4, 8);
      RW.Engine.mail(state, 'founder', 'คุณหมดไฟ (Burnout)', 'ร่างกายและจิตใจคุณถึงขีดจำกัด สมาธิสั้น ตัดสินใจพลาดง่าย ประสิทธิภาพลดครึ่งหนึ่งไปอีก ' + f.burnout + ' สัปดาห์ — ควรลาพักร้อนและลดชั่วโมงทำงาน', 'bad');
      state.flags.crisis = state.time.w;
    }
    // health
    var htarget = 95 - Math.max(0, f.hours - 55) * 0.6 - Math.max(0, f.stress - 60) * 0.5;
    f.health = U.clamp(U.approach(f.health, htarget, 0.04), 0, 100);
    // personal life
    var ltarget = 85 - Math.max(0, f.hours - 50) * 1.1 - (f.cash < 0 ? 20 : 0);
    f.life = U.clamp(U.approach(f.life, ltarget, 0.05), 0, 100);
    // learning by doing
    var hoursF = f.hours / 45;
    for (var k in f.focus) {
      var sk = RW.FOCUS[k].skill;
      if (sk === 'best') continue;
      var gain = 0.035 * hoursF * (f.focus[k] / 100) * (1 - f.skills[sk] / 100) * 1.4;
      f.skills[sk] = Math.min(95, f.skills[sk] + gain);
    }
    // leadership grows with team size handled
    f.skills.leadership = Math.min(95, f.skills.leadership + 0.004 * Math.min(30, RW.Team.headcount(state)) * (1 - f.skills.leadership / 100));
  };

  // Thai personal income tax (approx; standard deductions)
  Fd.pit = function (annual) {
    var taxable = annual - Math.min(100000, annual * 0.5) - 60000 - 9000;
    if (taxable <= 0) return 0;
    var br = [[150000, 0], [300000, 0.05], [500000, 0.10], [750000, 0.15], [1000000, 0.20], [2000000, 0.25], [5000000, 0.30], [Infinity, 0.35]];
    var tax = 0, prev = 0;
    for (var i = 0; i < br.length; i++) {
      var top = br[i][0];
      if (taxable > prev) tax += (Math.min(taxable, top) - prev) * br[i][1];
      prev = top;
    }
    return tax;
  };

  Fd.monthly = function (state) {
    var f = state.founder;
    var net = f.salary - Fd.pit(f.salary * 12) / 12 - Math.min(f.salary, 17500) * 0.05;
    f.cash += net - f.burn;
    if (f.cash < 0 && !state.flags.personalBroke) {
      state.flags.personalBroke = state.time.w;
      RW.Events.queue(state, 'personal_broke', {});
    }
    if (f.cash >= 0) state.flags.personalBroke = 0;
    // interest on personal savings (small)
    if (f.cash > 0) f.cash += f.cash * 0.012 / 12;
  };

  Fd.takeVacation = function (state, weeks) {
    state.founder.vacation = weeks;
  };

  // ---------- Co-founders ----------
  Fd.genCofounders = function (bg) {
    var opts = [];
    var roles = bg === 'engineer' ? ['ae', 'marketer', 'ops'] : bg === 'grad' ? ['eng', 'ae', 'marketer'] : ['eng', 'eng', 'ae', 'marketer', 'ops', 'finance'];
    roles = R.shuffle(roles).slice(0, 3);
    roles.forEach(function (role) {
      var skill = R.int(58, 86);
      opts.push({
        id: R.id('cf'), name: RW.Names.person(), nick: RW.Names.nick(), role: role, skill: skill,
        ask: R.pick([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5]), salary: R.pick([0, 15000, 25000, 35000]),
        trait: R.pick(['visionary', 'steady', 'stubborn', 'flaky', 'workhorse']),
        cash: R.pick([0, 0, 200000, 500000, 1000000])
      });
    });
    return opts;
  };

  RW.COFOUNDER_TRAITS = {
    visionary: { n: 'มีวิสัยทัศน์', d: 'ช่วยพิตช์และดึงดูดคนเก่ง แต่บางครั้งคิดใหญ่เกินตัว' },
    steady: { n: 'มั่นคง', d: 'ไว้ใจได้ ทำงานสม่ำเสมอ ขัดแย้งน้อย' },
    stubborn: { n: 'หัวแข็ง', d: 'เก่งแต่ถ้าไม่เห็นด้วยจะเถียงหนัก ความขัดแย้งสูง' },
    flaky: { n: 'ใจไม่นิ่ง', d: 'ถ้าบริษัทลำบาก มีโอกาสถอนตัวสูง' },
    workhorse: { n: 'ทำงานหนัก', d: 'ผลงานสูงมาก เสี่ยงหมดไฟ' }
  };

  Fd.cofounderWeekly = function (state) {
    (state.cofounders || []).forEach(function (c) {
      if (!c.active) return;
      var runway = state.kpi ? state.kpi.runway : 24;
      var t = 65 + (state.kpi ? U.clamp(state.kpi.momentum || 0, -10, 10) : 0) - (runway < 4 ? 15 : 0) - c.conflict * 0.3;
      if (c.salary < 20000 && state.time.w > 52) t -= 8;
      c.morale = U.clamp(U.approach(c.morale, t, 0.08), 0, 100);
      var cg = (c.trait === 'stubborn' ? 0.6 : 0.2) + (state.founder.stress > 70 ? 0.4 : 0) - 0.35;
      c.conflict = U.clamp(c.conflict + cg + R.normal(0, 0.4), 0, 100);
      if (c.trait === 'workhorse') c.skill = Math.min(95, c.skill + 0.02);
      // departure risk
      var q = 0.0008 * Math.exp((50 - c.morale) / 12) * (c.trait === 'flaky' ? 2.5 : 1) * (1 + c.conflict / 40);
      if (R.chance(q) && !state.flags.cofounderEvent) {
        state.flags.cofounderEvent = state.time.w;
        RW.Events.queue(state, 'cofounder_leaving', { cf: c.id });
      }
      if (c.conflict > 70 && R.chance(0.03) && !state.flags.cofounderFight) {
        state.flags.cofounderFight = state.time.w;
        RW.Events.queue(state, 'cofounder_conflict', { cf: c.id });
      }
    });
    if (state.flags.cofounderEvent && state.time.w - state.flags.cofounderEvent > 26) state.flags.cofounderEvent = 0;
    if (state.flags.cofounderFight && state.time.w - state.flags.cofounderFight > 20) state.flags.cofounderFight = 0;
  };
})(globalThis.RW = globalThis.RW || {});
