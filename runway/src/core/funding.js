/* RUNWAY — fundraising: cap table, SAFEs, priced rounds, term sheets, board, debt, exit waterfall */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, L = RW.Ledger, F = RW.F;
  var Fn = (RW.Funding = {});

  Fn.FOUNDER_SHARES = 10000000;
  // Traction score a company needs for investors to take a stage seriously
  Fn.BAR = { preseed: 18, seed: 50, A: 80, B: 95, C: 106, D: 115 };

  Fn.init = function (state, opt) {
    var holders = [{ id: 'founder', name: state.founder.name + ' (คุณ)', kind: 'founder', cls: 'common', shares: 0 }];
    return {
      stage: 'bootstrap', holders: holders, classes: { common: { n: 'หุ้นสามัญ', seniority: 0 } }, pool: 0,
      safes: [], rounds: [], investors: RW.genInvestors(state.industry), raise: null,
      board: { founderSeats: 1, investorSeats: 0, independent: 0, confidence: 65, lastW: -1, lowQuarters: 0, members: [] },
      lastPost: 0, lastPPS: 0, updates: false, relations: 50, boardPressure: 0, offers: [], ipo: null, flipped: false
    };
  };

  // ---------- Cap table ----------
  Fn.outstanding = function (state) { return U.sum(state.funding.holders, function (h) { return h.shares; }); };
  Fn.fullyDiluted = function (state) { return Fn.outstanding(state) + state.funding.pool; };
  Fn.holder = function (state, id) { return state.funding.holders.find(function (h) { return h.id === id; }); };
  Fn.founderShares = function (state) { var h = Fn.holder(state, 'founder'); return h ? h.shares : 0; };
  // ownership share taken by unconverted post-money SAFEs
  Fn.safeShare = function (state) { return Math.min(0.9, U.sum(state.funding.safes, function (x) { return x.amount / x.cap; })); };
  // founder ownership as-converted (SAFEs treated as converted at their caps)
  Fn.founderPct = function (state) { return Fn.founderShares(state) / Math.max(1, Fn.fullyDiluted(state)) * (1 - Fn.safeShare(state)); };
  Fn.pps = function (state) {
    if (state.funding.lastPPS > 0) return state.funding.lastPPS;
    return 0;
  };

  Fn.addHolder = function (state, h) {
    var ex = state.funding.holders.find(function (x) { return x.id === h.id && x.cls === h.cls; });
    if (ex) { ex.shares += h.shares; ex.invested = (ex.invested || 0) + (h.invested || 0); return ex; }
    state.funding.holders.push(h);
    return h;
  };

  Fn.grantOptions = function (state, e, shares) {
    var fund = state.funding;
    if (fund.pool < shares) {
      // top up the pool (board approval assumed while founder controls the board)
      fund.pool += shares - fund.pool;
    }
    fund.pool -= shares;
    e.options = (e.options || 0) + shares;
    Fn.addHolder(state, { id: 'emp_' + e.id, name: e.name + ' (ESOP)', kind: 'employee', cls: 'common', shares: shares, empId: e.id, grantW: state.time.w });
  };
  Fn.forfeitOptions = function (state, e) {
    var h = state.funding.holders.find(function (x) { return x.id === 'emp_' + e.id; });
    if (!h) return;
    // vested portion (4y, 1y cliff) stays with the leaver
    var tenure = state.time.w - (h.grantW || e.startW);
    var vestedFrac = tenure < 52 ? 0 : Math.min(1, tenure / 208);
    var unvested = Math.round(h.shares * (1 - vestedFrac));
    h.shares -= unvested;
    state.funding.pool += unvested;
    h.name = e.name + ' (อดีตพนักงาน)';
    if (h.shares <= 0) state.funding.holders = state.funding.holders.filter(function (x) { return x !== h; });
  };
  Fn.optionValue = function (state, e) {
    return (e.options || 0) * Math.max(Fn.pps(state), 0) * 0.5;
  };

  // ---------- Investor appetite ----------
  Fn.stageOfRaise = function (state) {
    var s = state.funding.stage;
    if (s === 'bootstrap') return 'preseed';
    var idx = RW.STAGE_ORDER.indexOf(s);
    return RW.STAGE_ORDER[Math.min(RW.STAGE_ORDER.length - 1, idx + 1)];
  };

  Fn.climate = function (state) { return state.world.vc * state.diff.vc; };

  Fn.fairPre = function (state, stage, inv) {
    var M = RW.Models[state.industry];
    var base = M.valuation(state);
    var st = RW.STAGES[stage];
    var lo = st.pre[0] * 0.5, hi = st.pre[1] * 2.2;
    var v = U.clamp(base, lo, hi) * Fn.climate(state);
    if (inv) v *= (inv.bias || 1);
    return v;
  };

  Fn.interest = function (state, inv, stage, askPre) {
    var M = RW.Models[state.industry];
    var tr = state.kpi.traction != null ? state.kpi.traction : M.traction(state).score;
    var bar = Fn.BAR[stage];
    // early-stage investors bet on founders; later stages are numbers-driven
    var div = { preseed: 11, seed: 9, A: 7, B: 7, C: 7, D: 7 }[stage] || 7;
    var x = (tr - bar) / div + (stage === 'preseed' ? 0.35 : stage === 'seed' ? 0.15 : 0);
    x += (inv.fit[state.industry] || 0.8) - 1;
    x += (state.founder.rep - 25) / 45 + (state.founder.skills.pitch - 50) / 40;
    x += (Fn.climate(state) - 1) * 2.2;
    x += inv.warm * 0.6;
    if (state.funding.raise && state.funding.raise.leadId) x += 0.9; // FOMO once a lead is in
    var fair = Fn.fairPre(state, stage, inv);
    var gap = askPre / fair - 1;
    if (gap > 0) x -= gap * 3.2; else x += Math.min(0.6, -gap * 1.2);
    // red flags
    if (state.flags.cofounderLeftUnvested) x -= 0.8;
    if (state.flags.fraudRisk) x -= 0.6;
    if (state.funding.raise && state.funding.raise.startW && state.time.w - state.funding.raise.startW > 16) x -= 0.5; // stale round
    if (state.flags.failedRaiseW && state.time.w - state.flags.failedRaiseW < 26) x -= 0.6;
    var runway = state.kpi.runway;
    if (runway < 3) x -= 0.6; // desperation shows
    var bgNet = RW.BACKGROUNDS[state.founder.bg].net.investors;
    x += (bgNet - 1) * 1.5;
    if (inv.type === 'accelerator') {
      // accelerators bet on teams and progress, not revenue
      var M2 = RW.Models[state.industry];
      var prog = state.biz && (state.biz.launched || (state.biz.skus && state.biz.skus.length) || (state.biz.branches && state.biz.branches.length)) ? 0.6 : 0;
      x = 0.2 + prog + (state.founder.skills.pitch - 50) / 40 + (state.founder.rep - 20) / 50 + ((state.cofounders || []).some(function (c) { return c.active; }) ? 0.4 : 0) - Math.max(0, askPre / fair - 1.5);
    }
    if (inv.type === 'angel' && stage === 'preseed') x += 0.4;
    return U.clamp(U.sigmoid(x), 0.01, 0.97);
  };

  // ---------- Raise process ----------
  Fn.eligibleInvestors = function (state, stage) {
    return state.funding.investors.filter(function (inv) {
      return inv.stages.indexOf(stage) >= 0 && inv.passedUntil < state.time.w;
    });
  };

  Fn.startRaise = function (state, opt) {
    var fund = state.funding;
    if (fund.raise) return false;
    fund.raise = {
      stage: opt.stage, instrument: opt.instrument, target: opt.target, minClose: opt.minClose || opt.target * 0.6,
      ask: opt.ask, discount: opt.discount || 0.2, startW: state.time.w, pipeline: [], termSheets: [], commits: [],
      leadId: null, leadTerms: null, status: 'active', closingW: null, log: []
    };
    (opt.investors || []).forEach(function (id) { Fn.pitch(state, id); });
    Fn.raiseLog(state, 'เปิดระดมทุน ' + RW.STAGES[opt.stage].n + ' เป้า ' + F.m(opt.target) + (opt.instrument === 'safe' ? ' (SAFE, Valuation cap ' + F.m(opt.ask) + ')' : ' (Pre-money ที่ขอ ' + F.m(opt.ask) + ')'));
    return true;
  };

  Fn.raiseLog = function (state, msg) {
    var r = state.funding.raise;
    if (r) { r.log.unshift({ w: state.time.w, m: msg }); if (r.log.length > 40) r.log.pop(); }
  };

  Fn.pipelineCap = function (state) {
    var u = RW.Team.capOf(state, 'f_fundraise') + RW.Team.capOf(state, 'lead_finance') * 0.5;
    return Math.floor(3 + u * 10);
  };

  Fn.pitch = function (state, invId) {
    var r = state.funding.raise;
    if (!r) return false;
    if (r.pipeline.find(function (p) { return p.invId === invId; })) return false;
    var inv = state.funding.investors.find(function (i) { return i.id === invId; });
    if (!inv) return false;
    r.pipeline.push({ invId: invId, step: 0, status: 'active', weeks: 0, prog: 0 });
    return true;
  };

  Fn.STEPS = ['ขอ intro / ส่ง deck', 'ประชุมครั้งแรก', 'ประชุม Partner / ส่งตัวเลข', 'Due Diligence', 'ยื่น Term Sheet'];

  Fn.activePitches = function (state) {
    var r = state.funding.raise;
    return r ? r.pipeline.filter(function (p) { return p.status === 'active'; }).length : 0;
  };

  Fn.weekly = function (state) {
    var fund = state.funding, r = fund.raise;
    // investor warmth decays slowly
    fund.investors.forEach(function (i) { i.warm = Math.max(0, i.warm - 0.004); });
    if (!r) return;
    if (r.status === 'closing') {
      if (state.time.w >= r.closingW) Fn.closeRound(state);
      return;
    }
    var effort = RW.Team.capOf(state, 'f_fundraise') + RW.Team.capOf(state, 'lead_finance') * 0.3;
    var cap = Fn.pipelineCap(state);
    var active = r.pipeline.filter(function (p) { return p.status === 'active'; });
    // only the first `cap` active conversations move forward
    active.slice(0, cap).forEach(function (p) {
      var inv = fund.investors.find(function (i) { return i.id === p.invId; });
      p.weeks++;
      var speed = (0.5 + effort * 0.8) / inv.speed * 1.6;
      if (inv.type === 'angel' || inv.type === 'accelerator') speed *= 1.3;
      p.prog += speed * R.range(0.6, 1.4);
      if (p.prog < 1) return;
      p.prog = 0;
      var interest = Fn.interest(state, inv, r.stage, r.ask);
      p.interest = interest;
      // drop-off at each gate
      var passP = (1 - interest) * (p.step === 0 ? 0.7 : 0.6);
      if (R.chance(passP)) {
        p.status = 'passed';
        p.reason = Fn.passReason(state, inv, r);
        inv.passedUntil = state.time.w + 26;
        inv.history.push({ w: state.time.w, m: 'ปฏิเสธ: ' + p.reason });
        Fn.raiseLog(state, inv.name + ' ขอผ่าน — "' + p.reason + '"');
        return;
      }
      p.step++;
      // angels and SAFEs skip heavy DD
      var light = r.instrument === 'safe' || inv.type === 'angel' || inv.type === 'accelerator';
      if (light && p.step === 2) p.step = 4;
      if (p.step === 3) Fn.raiseLog(state, inv.name + ' เริ่มทำ Due Diligence — ขอเอกสารบัญชี สัญญา และข้อมูลลูกค้า');
      if (p.step >= 4) Fn.investorDecides(state, inv, p, interest);
      else Fn.raiseLog(state, inv.name + ': ' + Fn.STEPS[p.step]);
    });
    // timeout
    if (state.time.w - r.startW > 30 && r.status === 'active' && !r.leadId && r.commits.length === 0) {
      Fn.failRaise(state, 'ระดมทุนนานเกิน 7 เดือนโดยไม่มีใครนำรอบ — ตลาดเริ่มมองว่าเป็น "ดีลค้างตลาด"');
    }
  };

  Fn.passReason = function (state, inv, r) {
    var M = RW.Models[state.industry];
    var tr = M.traction(state).score;
    var bar = Fn.BAR[r.stage];
    var fair = Fn.fairPre(state, r.stage, inv);
    if (r.ask > fair * 1.35) return 'ราคาที่ขอสูงเกินไปมากสำหรับตัวเลขตอนนี้';
    if (tr < bar * 0.7) return 'ยังเร็วไปสำหรับเรา ขอดู traction อีก 6-12 เดือน';
    if (inv.fit[state.industry] < 0.8) return 'ไม่ตรงกับ thesis ของกองทุน';
    if (Fn.climate(state) < 0.75) return 'ตอนนี้กองทุนเน้นดูแลพอร์ตเดิม ชะลอการลงทุนใหม่';
    return R.pick(['ตลาดดูเล็กไปสำหรับขนาดกองทุนเรา', 'ห่วงเรื่องคู่แข่งที่มีเงินทุนมากกว่า', 'ทีมยังขาดคนสำคัญบางตำแหน่ง', 'unit economics ยังไม่ชัดพอ', 'partner คนอื่นในกองทุนไม่เห็นด้วย']);
  };

  Fn.investorDecides = function (state, inv, p, interest) {
    var r = state.funding.raise;
    // final investment committee
    if (!R.chance(interest * 1.1)) {
      p.status = 'passed';
      p.reason = Fn.passReason(state, inv, r);
      inv.passedUntil = state.time.w + 26;
      Fn.raiseLog(state, inv.name + ' (คณะกรรมการลงทุน) ตัดสินใจไม่ลงทุน — "' + p.reason + '"');
      return;
    }
    var need = Math.max(0, r.target - Fn.committed(state));
    if (r.instrument === 'safe') {
      need = Math.max(0, r.target - (r.raised || 0));
      if (need < 100000 && inv.type !== 'accelerator') { p.status = 'passed'; p.reason = 'รอบเต็มแล้ว'; return; }
      var amt = U.clamp(need * R.range(0.3, 0.7), inv.check[0], Math.min(inv.check[1], Math.max(need, inv.check[0])));
      if (inv.type === 'accelerator') amt = inv.check[0];
      amt = Math.round(amt / 100000) * 100000;
      p.status = 'termsheet';
      var ts = {
        id: R.id('ts'), invId: inv.id, kind: 'safe', amount: amt, cap: r.ask, discount: r.discount, expires: state.time.w + 2, lead: false,
        fixedPct: inv.fixedPct
      };
      if (inv.type === 'accelerator') { ts.kind = 'accelerator'; ts.cap = inv.fixedPct ? amt / inv.fixedPct : 0; }
      r.termSheets.push(ts);
      RW.Events.queue(state, 'term_sheet', { ts: ts.id });
      return;
    }
    // priced round
    if (!r.leadId) {
      if (!inv.lead) {
        p.status = 'waiting';
        Fn.raiseLog(state, inv.name + ' สนใจ แต่จะร่วมลงทุนเมื่อมี Lead investor แล้วเท่านั้น');
        return;
      }
      var fair = Fn.fairPre(state, r.stage, inv);
      var maxPre = fair * (1 + 0.25 * interest);
      var pre = r.ask <= maxPre ? r.ask : Math.round(fair * R.range(0.85, 1.0) / 1e6) * 1e6;
      var amtL = U.clamp(r.target * R.range(0.45, 0.75), inv.check[0], inv.check[1]);
      amtL = Math.round(amtL / 1e6) * 1e6;
      var harsh = (100 - inv.friendly) / 100 + (1 - Fn.climate(state)) * 0.8;
      var ts2 = {
        id: R.id('ts'), invId: inv.id, kind: 'priced', amount: amtL, pre: pre, lead: true, expires: state.time.w + R.int(1, 3),
        pref: harsh > 0.85 ? '2x' : harsh > 0.6 ? '1xp' : '1x', anti: harsh > 0.95 ? 'full' : 'broad',
        boardSeat: r.stage !== 'preseed', poolPct: r.stage === 'seed' ? 0.10 : r.stage === 'A' ? 0.12 : 0.08,
        proRata: true, founderVesting: !state.flags.founderVested && r.stage !== 'preseed' && R.chance(0.5),
        flip: !state.funding.flipped && (r.stage === 'A' || r.stage === 'B') && R.chance(0.5)
      };
      p.status = 'termsheet';
      r.termSheets.push(ts2);
      RW.Events.queue(state, 'term_sheet', { ts: ts2.id });
    } else {
      Fn.followerCommit(state, inv, p);
    }
  };

  Fn.followerCommit = function (state, inv, p) {
    var r = state.funding.raise;
    var need = Math.max(0, r.target * 1.2 - Fn.committed(state));
    if (need < inv.check[0] * 0.5) { p.status = 'passed'; p.reason = 'รอบเต็มแล้ว'; return; }
    var amt = Math.round(U.clamp(need * R.range(0.3, 0.8), inv.check[0], inv.check[1]) / 1e5) * 1e5;
    r.commits.push({ invId: inv.id, amount: amt });
    p.status = 'committed';
    Fn.raiseLog(state, inv.name + ' ยืนยันร่วมลงทุน ' + F.m(amt) + ' ตามเงื่อนไขของ Lead');
  };

  Fn.committed = function (state) {
    var r = state.funding.raise;
    if (!r) return 0;
    return U.sum(r.commits, function (c) { return c.amount; });
  };

  Fn.findTS = function (state, id) {
    var r = state.funding.raise;
    return r ? r.termSheets.find(function (t) { return t.id === id; }) : null;
  };

  // player response to a term sheet: 'accept' | 'counter' | 'decline'
  Fn.respondTS = function (state, tsId, action, counterPre) {
    var r = state.funding.raise;
    var ts = Fn.findTS(state, tsId);
    if (!ts || !r) return { ok: false, msg: 'Term sheet หมดอายุแล้ว' };
    var inv = state.funding.investors.find(function (i) { return i.id === ts.invId; });
    var p = r.pipeline.find(function (x) { return x.invId === ts.invId; });
    r.termSheets = r.termSheets.filter(function (t) { return t.id !== tsId; });
    if (action === 'decline') {
      if (p) p.status = 'declined';
      Fn.raiseLog(state, 'คุณปฏิเสธข้อเสนอของ ' + inv.name);
      return { ok: true, msg: 'ปฏิเสธข้อเสนอแล้ว' };
    }
    if (action === 'counter') {
      var interest = Fn.interest(state, inv, r.stage, ts.kind === 'priced' ? counterPre : ts.cap);
      var fair = Fn.fairPre(state, r.stage, inv);
      var base = ts.kind === 'priced' ? ts.pre : ts.cap;
      var ratio = counterPre / Math.max(1, base);
      var pAccept = U.clamp(interest * 1.1 - (ratio - 1) * 2.2 - (counterPre > fair * 1.3 ? 0.3 : 0), 0.03, 0.9);
      var roll = R.f();
      if (roll < pAccept) {
        if (ts.kind === 'priced') ts.pre = counterPre; else ts.cap = counterPre;
        Fn.raiseLog(state, inv.name + ' ยอมรับราคาที่คุณต่อรอง ' + F.m(counterPre));
        return Fn.acceptTS(state, ts, inv, p);
      }
      if (roll < pAccept + 0.35) {
        // meet in the middle
        var mid = Math.round((base + counterPre) / 2 / 1e5) * 1e5;
        if (ts.kind === 'priced') ts.pre = mid; else ts.cap = mid;
        ts.expires = state.time.w + 1;
        r.termSheets.push(ts);
        Fn.raiseLog(state, inv.name + ' เสนอกลับที่ ' + F.m(mid) + ' — ข้อเสนอสุดท้าย');
        RW.Events.queue(state, 'term_sheet', { ts: ts.id, final: true });
        return { ok: true, msg: inv.name + ' เสนอกลับที่ ' + F.m(mid) };
      }
      if (p) p.status = 'passed';
      inv.passedUntil = state.time.w + 26;
      Fn.raiseLog(state, inv.name + ' ถอนข้อเสนอหลังการต่อรอง');
      return { ok: false, msg: inv.name + ' ถอนตัวจากดีล — คุณต่อรองแรงเกินไป' };
    }
    return Fn.acceptTS(state, ts, inv, p);
  };

  Fn.acceptTS = function (state, ts, inv, p) {
    var r = state.funding.raise;
    if (ts.kind === 'safe' || ts.kind === 'accelerator') {
      // rolling close: money arrives within ~2 weeks
      if (ts.kind === 'accelerator') {
        if (ts.fixedPct > 0) Fn.issuePriced(state, inv, ts.amount, ts.amount / ts.fixedPct - ts.amount, 'Accelerator', { pref: '1x' }, true);
        else L.post(state.fin, { cash: ts.amount, other_income: -ts.amount }, 'op');
        state.flags.accelerator = { until: state.time.w + 12, inv: inv.id };
        state.founder.rep += 6;
        state.funding.investors.forEach(function (i) { if (i.type === 'vc' || i.type === 'angel') i.warm = Math.min(1.5, i.warm + 0.3); });
      } else {
        var room = r.target * 1.2 - (r.raised || 0);
        if (room < 100000) { if (p) p.status = 'passed'; Fn.raiseLog(state, 'รอบเต็มแล้ว — ขอบคุณ ' + inv.name); return { ok: false, msg: 'รอบนี้ระดมทุนครบแล้ว' }; }
        ts.amount = Math.min(ts.amount, Math.round(room / 100000) * 100000);
        Fn.issueSafe(state, inv, ts.amount, ts.cap, ts.discount);
        r.raised = (r.raised || 0) + ts.amount;
        if (r.raised >= r.target) {
          Fn.raiseLog(state, 'ระดมทุนครบเป้าแล้ว');
          r.termSheets = [];
          state.funding.raise = null;
          RW.Engine.mail(state, 'funding', 'ปิดรอบ SAFE ครบเป้า', 'ได้รับเงินรวม ' + F.m(r.raised) + ' ที่ valuation cap ' + F.m(r.ask) + ' — SAFE จะแปลงเป็นหุ้นในรอบ priced ถัดไป', 'good');
          state.events.pending = state.events.pending.filter(function (e) { return e.id !== 'term_sheet'; });
        }
      }
      if (p) p.status = 'committed';
      inv.warm += 0.5;
      Fn.raiseLog(state, 'ปิดดีลกับ ' + inv.name + ' ' + F.m(ts.amount) + ' — เงินเข้าบัญชีแล้ว');
      return { ok: true, msg: 'ได้รับเงิน ' + F.m(ts.amount) + ' จาก ' + inv.name };
    }
    // priced lead accepted
    r.leadId = inv.id;
    r.leadTerms = ts;
    r.ask = ts.pre;
    r.commits.push({ invId: inv.id, amount: ts.amount, lead: true });
    if (p) p.status = 'committed';
    Fn.raiseLog(state, inv.name + ' เป็น Lead investor ' + F.m(ts.amount) + ' ที่ pre-money ' + F.m(ts.pre));
    // investors waiting for a lead now decide
    r.pipeline.forEach(function (q) {
      if (q.status === 'waiting') {
        var i2 = state.funding.investors.find(function (i) { return i.id === q.invId; });
        if (R.chance(Fn.interest(state, i2, r.stage, r.ask) + 0.2)) Fn.followerCommit(state, i2, q);
        else { q.status = 'passed'; q.reason = 'ไม่ร่วมรอบนี้'; }
      }
    });
    return { ok: true, msg: 'ได้ Lead investor แล้ว! หานักลงทุนร่วมต่อ แล้วกด "ปิดรอบ" เมื่อพร้อม' };
  };

  Fn.startClosing = function (state) {
    var r = state.funding.raise;
    if (!r || !r.leadId) return false;
    r.status = 'closing';
    var weeks = R.int(3, 6) - (RW.Team.capOf(state, 'lead_finance') > 0.4 ? 1 : 0);
    r.closingW = state.time.w + weeks;
    Fn.raiseLog(state, 'เริ่มขั้นตอนปิดรอบ: ทนายร่างสัญญา SHA/SSA และ Due Diligence ฉบับเต็ม (~' + weeks + ' สัปดาห์)');
    // DD can surface problems
    RW.Events.queue(state, 'dd_check', {}, state.time.w + Math.max(1, weeks - 2));
    return true;
  };

  Fn.closeRound = function (state) {
    var fund = state.funding, r = fund.raise;
    var ts = r.leadTerms;
    var total = Fn.committed(state);
    var lead = fund.investors.find(function (i) { return i.id === r.leadId; });
    // pre-money option pool top-up (the "option pool shuffle")
    var preFD = Fn.fullyDiluted(state);
    var safeSharesEst = 0;
    var pre = ts.pre;
    // pool target is % of post-money FD; created pre-money so it dilutes only existing holders
    var post = pre + total;
    var poolTarget = ts.poolPct;
    // iterate to solve for pool & SAFE conversion
    var pps = pre / preFD, newPool = 0;
    for (var it = 0; it < 6; it++) {
      safeSharesEst = Fn.safeSharesAt(state, pps, preFD);
      var postFD = (preFD + newPool + safeSharesEst) + total / pps;
      var poolWanted = Math.max(0, poolTarget * postFD - fund.pool);
      newPool = poolWanted;
      pps = pre / (preFD + newPool + safeSharesEst);
    }
    fund.pool += Math.round(newPool);
    Fn.convertSafes(state, pps, preFD);
    var cls = RW.STAGES[r.stage].n;
    var downRound = fund.lastPPS > 0 && pps < fund.lastPPS;
    if (downRound) Fn.antiDilution(state, pps, total / pps);
    fund.classes[cls] = { n: cls, seniority: Object.keys(fund.classes).length, pref: ts.pref, pps: pps, invested: total };
    r.commits.forEach(function (c) {
      var inv = fund.investors.find(function (i) { return i.id === c.invId; });
      Fn.addHolder(state, { id: inv.id, name: inv.name, kind: 'investor', cls: cls, shares: Math.round(c.amount / pps), invested: c.amount });
      inv.warm += 0.5;
      inv.history.push({ w: state.time.w, m: 'ลงทุน ' + F.m(c.amount) + ' ในรอบ ' + cls });
    });
    L.post(state.fin, { cash: total, capital: -total }, 'fin');
    var legal = Math.max(250000, total * 0.012) * (ts.flip ? 2.2 : 1);
    L.spend(state.fin, 'prof', legal);
    fund.rounds.push({ stage: r.stage, w: state.time.w, amount: total, pre: pre, post: pre + total, pps: pps, lead: lead.name, instrument: 'priced', down: downRound, terms: ts });
    fund.stage = r.stage;
    fund.lastPost = pre + total;
    fund.lastPPS = pps;
    if (ts.boardSeat) { fund.board.investorSeats++; fund.board.members.push({ who: lead.name, kind: 'investor' }); }
    // at Series A founders typically secure a second common-holder seat; an independent chair joins
    if (r.stage === 'A' && fund.board.founderSeats < 2) { fund.board.founderSeats = 2; fund.board.independent = 1; }
    if (ts.founderVesting) state.flags.founderVested = state.time.w;
    if (ts.flip) fund.flipped = true;
    if (lead.rofr) state.flags.rofr = lead.id;
    fund.board.confidence = 70;
    RW.Team.addMod(state, downRound ? -8 : 8, 16, downRound ? 'Down round — มูลค่าบริษัทลดลง' : 'ระดมทุนสำเร็จ ทีมมั่นใจขึ้น');
    state.founder.rep += downRound ? -4 : 5 + RW.STAGE_ORDER.indexOf(r.stage);
    RW.Engine.mail(state, 'funding', 'ปิดรอบ ' + cls + ' สำเร็จ: ' + F.m(total), 'Pre-money ' + F.m(pre) + ' · Post-money ' + F.m(pre + total) + ' · ราคาต่อหุ้น ' + F.b(pps) + ' · ค่าที่ปรึกษากฎหมาย ' + F.m(legal) + (ts.flip ? ' (รวมค่าย้าย Holding ไปสิงคโปร์)' : '') + ' · ผู้ก่อตั้งถือหุ้น ' + F.pct(Fn.founderPct(state)), downRound ? 'warn' : 'good');
    fund.raise = null;
    state.stats.raised += total;
  };

  Fn.failRaise = function (state, why) {
    var fund = state.funding;
    RW.Engine.mail(state, 'funding', 'การระดมทุนล้มเหลว', why + ' — ทีมรับรู้และขวัญกำลังใจลดลง', 'bad');
    RW.Team.addMod(state, -6, 12, 'ระดมทุนไม่สำเร็จ');
    state.flags.failedRaiseW = state.time.w;
    state.founder.rep = Math.max(0, state.founder.rep - 3);
    fund.raise = null;
  };

  Fn.cancelRaise = function (state) {
    var r = state.funding.raise;
    if (!r) return;
    if (r.status === 'closing') return;
    if (r.leadId) {
      // backing out after signing a term sheet burns bridges
      var lead = state.funding.investors.find(function (i) { return i.id === r.leadId; });
      lead.passedUntil = state.time.w + 104; lead.warm = 0;
      state.founder.rep = Math.max(0, state.founder.rep - 5);
    }
    state.funding.raise = null;
    RW.Engine.mail(state, 'funding', 'ยุติการระดมทุน', 'คุณปิดกระบวนการระดมทุนรอบนี้');
  };

  // ---------- SAFE ----------
  Fn.issueSafe = function (state, inv, amount, cap, discount) {
    var fund = state.funding;
    fund.safes.push({ id: R.id('sf'), invId: inv.id, name: inv.name, amount: amount, cap: cap, discount: discount, w: state.time.w });
    L.post(state.fin, { cash: amount, safe: -amount }, 'fin');
    inv.history.push({ w: state.time.w, m: 'ลงทุน SAFE ' + F.m(amount) + ' cap ' + F.m(cap) });
    if (fund.stage === 'bootstrap') fund.stage = 'preseed';
    if (!fund.lastPost) fund.lastPost = cap;
    state.stats.raised += amount;
  };
  // post-money SAFE: ownership = amount / cap; price = min(cap price, round price * (1 - discount))
  Fn.safeSharesAt = function (state, roundPPS, preFD) {
    var s = 0;
    state.funding.safes.forEach(function (sf) {
      var capPPS = sf.cap / preFD;
      var price = Math.min(capPPS, roundPPS * (1 - sf.discount));
      s += sf.amount / price;
    });
    return s;
  };
  Fn.convertSafes = function (state, roundPPS, preFD) {
    var fund = state.funding;
    if (!fund.safes.length) return;
    var cls = 'SAFE';
    fund.classes[cls] = fund.classes[cls] || { n: 'หุ้นบุริมสิทธิ์จาก SAFE', seniority: 0.5, pref: '1x', invested: 0 };
    fund.safes.forEach(function (sf) {
      var capPPS = sf.cap / preFD;
      var price = Math.min(capPPS, roundPPS * (1 - sf.discount));
      var sh = Math.round(sf.amount / price);
      Fn.addHolder(state, { id: sf.invId, name: sf.name, kind: 'investor', cls: cls, shares: sh, invested: sf.amount });
      fund.classes[cls].invested += sf.amount;
      L.post(state.fin, { safe: sf.amount, capital: -sf.amount });
    });
    fund.classes[cls].pps = roundPPS;
    fund.safes = [];
  };

  // Equity issued directly (accelerator / angel priced deals / insider)
  Fn.issuePriced = function (state, inv, amount, pre, clsName, terms, noRound) {
    var fund = state.funding;
    var fd = Fn.fullyDiluted(state);
    var pps = pre / fd;
    fund.classes[clsName] = fund.classes[clsName] || { n: clsName, seniority: Object.keys(fund.classes).length, pref: (terms && terms.pref) || '1x', pps: pps, invested: 0 };
    fund.classes[clsName].invested += amount;
    Fn.addHolder(state, { id: inv.id, name: inv.name, kind: 'investor', cls: clsName, shares: Math.round(amount / pps), invested: amount });
    L.post(state.fin, { cash: amount, capital: -amount }, 'fin');
    if (!noRound) fund.rounds.push({ stage: clsName, w: state.time.w, amount: amount, pre: pre, post: pre + amount, pps: pps, lead: inv.name, instrument: 'priced' });
    else fund.rounds.push({ stage: clsName, w: state.time.w, amount: amount, pre: pre, post: pre + amount, pps: pps, lead: inv.name, instrument: 'equity' });
    if (fund.stage === 'bootstrap') fund.stage = 'preseed';
    fund.lastPost = Math.max(fund.lastPost, pre + amount);
    fund.lastPPS = pps;
    state.stats.raised += amount;
  };

  // Anti-dilution for down rounds: extra shares to protected preferred holders
  Fn.antiDilution = function (state, newPPS, newShares) {
    var fund = state.funding;
    var A = Fn.fullyDiluted(state);
    Object.keys(fund.classes).forEach(function (c) {
      var cl = fund.classes[c];
      if (!cl.pps || c === 'common' || cl.pps <= newPPS) return;
      var anti = (fund.rounds.find(function (r) { return RW.STAGES[r.stage] && RW.STAGES[r.stage].n === c; }) || {}).terms;
      var mode = anti && anti.anti === 'full' ? 'full' : 'broad';
      var CP2;
      if (mode === 'full') CP2 = newPPS;
      else {
        var B = (newShares * newPPS) / cl.pps;
        CP2 = cl.pps * (A + B) / (A + newShares);
      }
      var factor = cl.pps / CP2;
      fund.holders.forEach(function (h) { if (h.cls === c) h.shares = Math.round(h.shares * factor); });
      cl.pps = CP2;
    });
  };

  // ---------- Board ----------
  Fn.investorControl = function (state) {
    var b = state.funding.board;
    var cf = (state.cofounders || []).filter(function (c) { return c.active && c.boardSeat; }).length;
    return b.investorSeats > b.founderSeats + cf;
  };

  Fn.boardQuarterly = function (state) {
    var fund = state.funding, b = fund.board;
    if (b.investorSeats === 0 && fund.rounds.length === 0) return;
    var M = RW.Models[state.industry];
    var g = state.kpi.qoqGrowth || 0;
    var expect = { preseed: 0.3, seed: 0.3, A: 0.2, B: 0.13, C: 0.09, D: 0.06, Accelerator: 0.3 }[fund.stage] || 0.15;
    var preRev = (state.kpi.revenueMonthly || 0) < 30000;
    var delta;
    if (preRev) {
      // before revenue, boards judge progress toward a sellable product and first customers
      var tr = state.kpi.traction || 0;
      var lastTr = b.lastTraction || 0;
      delta = U.clamp((tr - lastTr) * 2, -12, 15) - 4;
      b.lastTraction = tr;
    } else delta = (g - expect) * 60;
    var runway = state.kpi.runway;
    if (runway < 6) delta -= 12;
    if (state.kpi.burnMultiple > 3) delta -= 6;
    if (state.kpi.burnMultiple > 0 && state.kpi.burnMultiple < 1.5) delta += 4;
    if (fund.updates) delta += 3;
    if (state.kpi.ebitdaMargin > 0) delta += 6;
    b.confidence = U.clamp(U.approach(b.confidence, 60 + delta, 0.6), 0, 100);
    if (b.confidence < 30) b.lowQuarters++; else b.lowQuarters = 0;
    fund.boardPressure = Math.max(0, 50 - b.confidence);
    var mood = b.confidence >= 70 ? 'พอใจมาก' : b.confidence >= 50 ? 'พอใจ' : b.confidence >= 30 ? 'กังวล' : 'ไม่พอใจอย่างหนัก';
    var body = (preRev ? 'ยังไม่มีรายได้ที่มีนัยสำคัญ — บอร์ดดูความคืบหน้าของสินค้าและลูกค้ารายแรก (Traction score ' + Math.round(state.kpi.traction || 0) + ')' : 'การเติบโตไตรมาสนี้ ' + F.spct(g) + ' (คาดหวัง ' + F.spct(expect) + ')') + ' · Runway ' + F.months(runway) + ' · ความเชื่อมั่นของบอร์ด: ' + Math.round(b.confidence) + '/100 (' + mood + ')';
    RW.Engine.mail(state, 'funding', 'ประชุมบอร์ดประจำไตรมาส', body, b.confidence < 40 ? 'warn' : 'info');
    if (b.confidence < 35 && b.investorSeats > 0) RW.Events.queue(state, 'board_pressure', {});
    if (Fn.investorControl(state) && b.lowQuarters >= 2 && b.confidence < 20) RW.Events.queue(state, 'ceo_replace', {});
  };

  // ---------- Debt products ----------
  Fn.debtOffers = function (state) {
    var offers = [];
    var M = RW.Models[state.industry];
    var age = state.time.w / 52;
    var p = state.kpi;
    var rate = state.world.macro.rate;
    var stIdx = RW.STAGE_ORDER.indexOf(state.funding.stage);
    // shareholder loan from founder's savings
    offers.push({ kind: 'founder', n: 'เงินกู้จากผู้ก่อตั้ง (เงินส่วนตัว)', max: Math.max(0, Math.floor(state.founder.cash / 50000) * 50000), rate: 0.0, months: 0, d: 'ยืมเงินเก็บส่วนตัวให้บริษัท ไม่มีดอกเบี้ย ถอนคืนเมื่อบริษัทพร้อม' });
    // government-backed SME loan
    var smeOk = state.company.registered && age >= 1 && p.revenueTTM > 1e6;
    offers.push({ kind: 'bank', n: 'สินเชื่อ SME + ค้ำประกันโดยกองทุนค้ำประกันสินเชื่อ', max: smeOk ? Math.min(15e6, p.revenueTTM * 0.3) : 0, rate: rate + 0.045, months: 60, interestOnly: 6, d: smeOk ? 'ดอกเบี้ย ' + F.pct(rate + 0.045) + ' ผ่อน 5 ปี ผู้ก่อตั้งต้องค้ำประกันส่วนตัว' : 'ต้องจดบริษัทและดำเนินงานครบ 1 ปี มีรายได้ย้อนหลัง > ฿1M' });
    var bankOk = age >= 2 && p.ebitdaTTM > 0;
    offers.push({ kind: 'bank', n: 'สินเชื่อธนาคารพาณิชย์ (Term loan)', max: bankOk ? Math.min(100e6, p.ebitdaTTM * 3) : 0, rate: rate + 0.035, months: 60, interestOnly: 0, d: bankOk ? 'ต้องมีกำไรต่อเนื่อง วงเงินสูงสุด 3 เท่าของ EBITDA' : 'ธนาคารต้องการงบการเงินมีกำไร 2 ปี' });
    var vdOk = stIdx >= 2;
    var lastRound = state.funding.rounds.length ? state.funding.rounds[state.funding.rounds.length - 1] : null;
    offers.push({ kind: 'venture', n: 'Venture debt', max: vdOk && lastRound ? lastRound.amount * 0.3 : 0, rate: rate + 0.095, months: 36, interestOnly: 6, d: vdOk ? 'สำหรับบริษัทที่ VC หนุนหลัง ดอกเบี้ยสูง มี covenant' : 'ต้องผ่าน Series A ก่อน' });
    if (M.rbfEligible && M.rbfEligible(state)) {
      offers.push({ kind: 'rbf', n: 'Revenue-based financing', max: Math.min(30e6, p.revenueMonthly * 3), rate: 0, cap: 1.14, revShare: 0.1, d: 'รับเงินก่อน คืนเป็น 10% ของรายได้ทุกเดือนจนครบ 1.14 เท่า' });
    }
    return offers;
  };

  Fn.takeDebt = function (state, kind, amount) {
    var offers = Fn.debtOffers(state);
    var o = offers.find(function (x) { return x.kind === kind && x.max > 0; });
    if (!o || amount <= 0 || amount > o.max + 1) return false;
    if (kind === 'founder') {
      state.founder.cash -= amount;
      RW.Ledger.addLoan(state, { kind: 'founder', name: 'เงินกู้จากผู้ก่อตั้ง', amount: amount, rate: 0 });
      return true;
    }
    RW.Ledger.addLoan(state, { kind: kind, name: o.n, amount: amount, rate: o.rate, months: o.months, interestOnly: o.interestOnly || 0, revShare: o.revShare, cap: o.cap });
    if (kind === 'bank' || kind === 'venture') L.spend(state.fin, 'prof', Math.round(amount * 0.01));
    return true;
  };

  // ---------- Exit waterfall ----------
  Fn.PREFS = { '1x': { m: 1, part: false }, '1xp': { m: 1, part: true }, '2x': { m: 2, part: false } };

  Fn.waterfall = function (state, exitValue) {
    var fund = state.funding;
    var holders = fund.holders.slice();
    // outstanding SAFEs convert at cap
    var fd = Fn.fullyDiluted(state);
    var safeHolders = fund.safes.map(function (sf) {
      return { id: sf.invId, name: sf.name, kind: 'investor', cls: '_safe', shares: sf.amount / (sf.cap / fd), invested: sf.amount };
    });
    holders = holders.concat(safeHolders);
    var classes = {};
    holders.forEach(function (h) {
      if (!classes[h.cls]) {
        var c = fund.classes[h.cls] || { pref: '1x', seniority: 0.4 };
        var pr = h.cls === 'common' ? null : Fn.PREFS[c.pref || '1x'];
        classes[h.cls] = { cls: h.cls, shares: 0, invested: 0, m: pr ? pr.m : 0, part: pr ? pr.part : false, seniority: c.seniority || 0, pref: !!pr };
      }
      classes[h.cls].shares += h.shares;
      classes[h.cls].invested += h.invested || 0;
    });
    var prefClasses = Object.keys(classes).map(function (k) { return classes[k]; }).filter(function (c) { return c.pref; });
    prefClasses.sort(function (a, b) { return b.seniority - a.seniority; });
    prefClasses.forEach(function (c) { c.convert = !c.part ? true : false; });
    var payout = {};
    for (var it = 0; it < 25; it++) {
      var remaining = exitValue;
      payout = {};
      prefClasses.forEach(function (c) {
        if (c.part || !c.convert) {
          var pay = Math.min(remaining, c.m * c.invested);
          payout[c.cls] = pay; remaining -= pay;
        }
      });
      var pool = 0;
      Object.keys(classes).forEach(function (k) {
        var c = classes[k];
        if (!c.pref || c.convert || c.part) pool += c.shares;
      });
      var perShare = pool > 0 ? remaining / pool : 0;
      Object.keys(classes).forEach(function (k) {
        var c = classes[k];
        if (!c.pref || c.convert || c.part) payout[k] = (payout[k] || 0) + c.shares * perShare;
      });
      var changed = false;
      prefClasses.forEach(function (c) {
        if (c.part) return;
        var prefVal = c.m * c.invested;
        var convVal = c.shares * perShare;
        var wantConvert = convVal >= prefVal;
        if (wantConvert !== c.convert) { c.convert = wantConvert; changed = true; }
      });
      if (!changed) break;
    }
    var byHolder = holders.map(function (h) {
      var c = classes[h.cls];
      var amt = c.shares > 0 ? payout[h.cls] * h.shares / c.shares : 0;
      return { id: h.id, name: h.name, kind: h.kind, cls: h.cls, shares: h.shares, amount: amt };
    });
    var founder = U.sum(byHolder.filter(function (h) { return h.id === 'founder'; }), function (h) { return h.amount; });
    return { exit: exitValue, holders: byHolder, founder: founder, classes: classes };
  };

  // ---------- Acquisition offers ----------
  Fn.maybeAcquisitionOffer = function (state) {
    var M = RW.Models[state.industry];
    var tr = state.kpi.traction || 0;
    if (tr < 22 || state.funding.offers.length) return;
    var p = 0.012 + tr / 2500;
    if (state.kpi.runway < 4) p += 0.03; // vultures circle
    if (state.flags.banker && state.flags.banker > state.time.w) p += 0.08;
    if (!R.chance(p * (state.world.vc > 1 ? 1.2 : 0.9))) return;
    var base = Math.max(M.valuation(state) * Fn.climate(state), state.funding.lastPost * 0.6);
    var distressed = state.kpi.runway < 4;
    var kind = R.weighted(['strategic', 'pe', 'acquihire'], function (k) {
      if (k === 'acquihire') return distressed || tr < 30 ? 2 : 0.2;
      if (k === 'pe') return state.kpi.ebitdaMargin > 0.1 ? 1.5 : 0.2;
      return 1.2;
    });
    var mult = kind === 'strategic' ? R.range(1.0, 1.8) : kind === 'pe' ? R.range(0.8, 1.2) : R.range(0.15, 0.45);
    if (distressed) mult *= 0.6;
    var price = Math.round(base * mult / 1e6) * 1e6;
    if (kind === 'acquihire') price = Math.max(price, RW.Team.headcount(state) * 1.2e6);
    var buyers = {
      strategic: ['เครือรุ่งโรจน์ คอร์ปอเรชั่น', 'กลุ่มสยามธนา', 'Regional SuperApp จากสิงคโปร์', 'บริษัทซอฟต์แวร์ญี่ปุ่นที่ต้องการขยายเข้าไทย', 'คู่แข่งที่เพิ่งระดมทุนก้อนใหญ่'],
      pe: ['กองทุน Private Equity เอเชีย', 'กองทุน Buyout ของไทย'],
      acquihire: ['บริษัทเทคฯ ใหญ่ที่อยากได้ทีมคุณ', 'ยูนิคอร์นจากอินโดนีเซีย']
    };
    var offer = {
      id: R.id('ac'), kind: kind, buyer: R.pick(buyers[kind]), price: price, cash: kind === 'pe' ? 1 : R.pick([1, 0.8, 0.6]),
      earnout: kind === 'strategic' ? R.pick([0, 0.15, 0.25]) : 0, retention: kind === 'acquihire' ? 2 : R.pick([1, 2, 3]),
      expires: state.time.w + 6, w: state.time.w
    };
    state.funding.offers.push(offer);
    RW.Events.queue(state, 'acq_offer', { offer: offer.id });
  };
})(globalThis.RW = globalThis.RW || {});
