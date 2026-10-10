/* RUNWAY — event engine: dilemmas with choices, delayed consequences */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var E = (RW.Events = { defs: {}, effects: {} });

  E.init = function () { return { pending: [], scheduled: [], cooldown: {}, seen: {}, log: [] }; };

  E.register = function (def) { E.defs[def.id] = def; };
  E.effect = function (id, fn) { E.effects[id] = fn; };

  // queue an event (shown to the player as a decision)
  E.queue = function (state, id, data, atWeek) {
    var ev = state.events;
    if (!E.defs[id]) throw new Error('No event ' + id);
    // avoid duplicates of the same pending decision
    var dupKey = id + JSON.stringify(data || {});
    if (ev.pending.some(function (p) { return p.key === dupKey; })) return null;
    var p = { pid: R.id('ev'), id: id, data: data || {}, w: atWeek != null ? atWeek : state.time.w, key: dupKey };
    ev.pending.push(p);
    return p;
  };

  // schedule a hidden delayed consequence
  E.later = function (state, weeks, fxId, data) {
    state.events.scheduled.push({ w: state.time.w + weeks, fx: fxId, data: data || {} });
  };

  E.current = function (state) {
    var w = state.time.w;
    var list = state.events.pending.filter(function (p) { return p.w <= w; });
    return list.length ? list[0] : null;
  };
  E.dueCount = function (state) {
    var w = state.time.w;
    return state.events.pending.filter(function (p) { return p.w <= w; }).length;
  };

  E.render = function (state, p) {
    var d = E.defs[p.id];
    var title = typeof d.title === 'function' ? d.title(state, p.data) : d.title;
    var body = typeof d.body === 'function' ? d.body(state, p.data) : d.body;
    var choices = d.choices(state, p.data) || [];
    return { title: title, body: body, choices: choices, cat: d.cat || 'general', pid: p.pid, img: d.icon };
  };

  E.resolve = function (state, pid, idx) {
    var ev = state.events;
    var p = ev.pending.find(function (x) { return x.pid === pid; });
    if (!p) return null;
    var d = E.defs[p.id];
    var choices = d.choices(state, p.data);
    var c = choices[idx];
    if (!c || c.ok === false) return null;
    var title = typeof d.title === 'function' ? d.title(state, p.data) : d.title;
    ev.pending = ev.pending.filter(function (x) { return x.pid !== pid; });
    var res = c.fx ? c.fx(state, p.data) : '';
    ev.log.unshift({ w: state.time.w, title: title, choice: c.t, result: res || '' });
    if (ev.log.length > 150) ev.log.pop();
    return res || 'ดำเนินการแล้ว';
  };

  // event whose subject disappeared (e.g., employee left) gets dropped
  E.prune = function (state) {
    state.events.pending = state.events.pending.filter(function (p) {
      var d = E.defs[p.id];
      return !d.valid || d.valid(state, p.data);
    });
  };

  E.weekly = function (state) {
    var ev = state.events, w = state.time.w;
    // fire scheduled consequences
    var due = ev.scheduled.filter(function (s) { return s.w <= w; });
    ev.scheduled = ev.scheduled.filter(function (s) { return s.w > w; });
    due.forEach(function (s) { if (E.effects[s.fx]) E.effects[s.fx](state, s.data); });
    E.prune(state);
    // random events
    if (w < 3) return;
    var rate = 0.34;
    if (ev.pending.length >= 3) return;
    if (!R.chance(rate)) return;
    var harsh = state.diff.harsh;
    var cands = Object.keys(E.defs).map(function (k) { return E.defs[k]; }).filter(function (d) {
      if (!d.weight) return false;
      if (d.ind && d.ind.indexOf(state.industry) < 0) return false;
      if (d.once && ev.seen[d.id]) return false;
      if (ev.cooldown[d.id] && ev.cooldown[d.id] > w) return false;
      try { return !d.cond || d.cond(state); } catch (e) { return false; }
    });
    var pick = R.weighted(cands, function (d) {
      var wt = typeof d.weight === 'function' ? d.weight(state) : d.weight;
      if (d.bad) wt *= harsh;
      return wt;
    });
    if (!pick) return;
    var data = pick.init ? pick.init(state) : {};
    if (data === null) return;
    ev.seen[pick.id] = (ev.seen[pick.id] || 0) + 1;
    ev.cooldown[pick.id] = w + (pick.cooldown || 26);
    E.queue(state, pick.id, data);
  };

  // ---------- helpers used by event effects ----------
  var H = (E.H = {
    cash: function (state, amt, acct, memo) {
      if (amt < 0) L.spend(state.fin, acct || 'other_exp', -amt);
      else if (amt > 0) L.post(state.fin, { cash: amt, rev_other: -amt }, 'op');
    },
    personal: function (state, amt) { state.founder.cash += amt; },
    morale: function (state, v, weeks, why) { RW.Team.addMod(state, v, weeks || 12, why || ''); },
    rep: function (state, v) { state.founder.rep = U.clamp(state.founder.rep + v, 0, 100); },
    brand: function (state, v) { if (state.biz) state.biz.brand = U.clamp((state.biz.brand || 30) + v, 0, 100); },
    buzz: function (state, mult, weeks) { if (state.biz) { state.biz.buzz = state.biz.buzz || []; state.biz.buzz.push({ m: mult, weeks: weeks, total: weeks }); } },
    stress: function (state, v) { state.founder.stress = U.clamp(state.founder.stress + v, 0, 100); },
    energy: function (state, v) { state.founder.energy = U.clamp(state.founder.energy + v, 0, 100); },
    life: function (state, v) { state.founder.life = U.clamp(state.founder.life + v, 0, 100); },
    emp: function (state, id) { return RW.Team.find(state, id); },
    pickEmp: function (state, filter) {
      var list = RW.Team.active(state).filter(filter || function () { return true; });
      return list.length ? R.pick(list) : null;
    },
    mail: function (state, title, body, tone) { RW.Engine.mail(state, 'event', title, body, tone); },
    M: function (state) { return RW.Models[state.industry]; },
    pname: function (state) { return state.company.name; }
  });

  // =====================================================================
  //  QUEUED EVENTS (triggered by systems)
  // =====================================================================

  E.register({
    id: 'counter_offer', cat: 'team',
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: function (s, d) { var e = H.emp(s, d.emp); return e.name + ' ยื่นใบลาออก'; },
    body: function (s, d) {
      var e = H.emp(s, d.emp);
      var mk = RW.Team.marketSalary(s, e.role, e.level, e.skill);
      return e.name + ' (' + e.nick + ') ' + RW.ROLES[e.role].n + ' ระดับ' + RW.LEVELS[e.level] + ' ได้ข้อเสนอจากที่อื่น เงินเดือนประมาณ ' + F.b(Math.round(mk * 1.25 / 1000) * 1000) + ' ตอนนี้ได้ ' + F.b(e.salary) + '\n\nคนนี้เป็นคนสำคัญของทีม ถ้าเสียไปงานจะสะดุดและต้องใช้เวลาหาคนใหม่หลายเดือน แต่ถ้าทุ่มเงินเพื่อรั้งไว้ คนอื่นในทีมอาจรู้และคาดหวังแบบเดียวกัน';
    },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'ยื่นข้อเสนอโต้ +25% เงินเดือน', d: 'รั้งไว้ได้ค่อนข้างแน่ แต่คนอื่นอาจรู้', fx: function () {
          if (R.chance(0.72)) { e.salary = Math.round(e.salary * 1.25 / 500) * 500; e.leaving = false; e.morale = 75; e.lastRaiseW = s.time.w;
            if (R.chance(0.35)) H.morale(s, -3, 10, 'คนในทีมรู้ว่ามีคนได้ขึ้นเงินเดือนเพราะขู่ลาออก');
            return e.name + ' ตกลงอยู่ต่อ'; }
          return e.name + ' ขอบคุณแต่ยืนยันจะไป — "ไม่ใช่เรื่องเงินอย่างเดียว"'; } },
        { t: 'ให้หุ้น ESOP 0.3% + ขึ้นเงินเดือน 10%', d: 'ผูกใจระยะยาวด้วยหุ้น (vesting 4 ปี)', fx: function () {
          var sh = Math.round(RW.Funding.fullyDiluted(s) * 0.003);
          if (R.chance(0.6 + (RW.Funding.pps(s) > 0 ? 0.15 : 0))) { RW.Funding.grantOptions(s, e, sh); e.salary = Math.round(e.salary * 1.1 / 500) * 500; e.leaving = false; e.morale = 80; e.lastRaiseW = s.time.w; return e.name + ' ตัดสินใจอยู่ต่อ ตื่นเต้นกับการเป็นเจ้าของบริษัท'; }
          return e.name + ' ปฏิเสธ — หุ้นบริษัทเล็กยังจับต้องไม่ได้สำหรับเขา'; } },
        e.level < 5 ? { t: 'เลื่อนตำแหน่งเป็น' + RW.LEVELS[e.level + 1], d: 'เงินเดือนขึ้นตามตำแหน่งใหม่ และได้ความรับผิดชอบเพิ่ม', fx: function () {
          if (R.chance(0.65 + (e.traits.indexOf('ambitious') >= 0 ? 0.25 : 0))) { RW.Team.promote(s, e.id); e.leaving = false; return e.name + ' ยินดีรับตำแหน่งใหม่และอยู่ต่อ'; }
          return e.name + ' ขอบคุณแต่ตัดสินใจไปแล้ว'; } } : null,
        { t: 'ปล่อยไปด้วยดี ขอให้ส่งต่องานให้ครบ', d: 'ประหยัดเงิน รักษาโครงสร้างเงินเดือน', fx: function () { return 'คุณกล่าวขอบคุณ ' + e.name + ' — ทำงานถึง ' + RW.T.label(e.leaveW); } }
      ].filter(Boolean);
    }
  });

  E.register({
    id: 'personal_broke', cat: 'founder',
    title: 'เงินเก็บส่วนตัวของคุณหมดแล้ว',
    body: function (s) { return 'บัญชีส่วนตัวติดลบ ' + F.b(-s.founder.cash) + ' ค่าใช้จ่ายส่วนตัวเดือนละ ' + F.b(s.founder.burn) + ' แต่บริษัทจ่ายเงินเดือนคุณแค่ ' + F.b(s.founder.salary) + '\n\nผู้ก่อตั้งจำนวนมากล้มเลิกไม่ใช่เพราะบริษัทเจ๊ง แต่เพราะตัวเองไม่มีเงินจะกิน'; },
    choices: function (s) {
      return [
        { t: 'ขึ้นเงินเดือนตัวเองเป็น ' + F.b(Math.ceil(s.founder.burn * 1.15 / 1000) * 1000), d: 'บริษัท burn เพิ่ม นักลงทุนอาจตั้งคำถาม', fx: function () { s.founder.salary = Math.ceil(s.founder.burn * 1.15 / 1000) * 1000; return 'ปรับเงินเดือนผู้ก่อตั้งแล้ว'; } },
        { t: 'ยืมเงินครอบครัว ฿300,000', d: 'ความสัมพันธ์ในครอบครัวตึงเครียด', fx: function () { H.personal(s, 300000); H.life(s, -12); H.stress(s, 6); return 'แม่โอนเงินมาให้พร้อมคำถามว่า "เมื่อไหร่จะหางานประจำทำ"'; } },
        { t: 'ขายรถ/ทรัพย์สินส่วนตัว ฿450,000', d: 'ได้เงินก้อนแต่ชีวิตลำบากขึ้น', fx: function () { H.personal(s, 450000); H.life(s, -6); s.founder.burn = Math.round(s.founder.burn * 0.92); return 'ขายรถไปแล้ว นั่ง BTS ไปทำงานแทน ค่าใช้จ่ายลดลงเล็กน้อย'; } },
        { t: 'ลดค่าใช้จ่ายส่วนตัว ย้ายไปห้องเช่าเล็กลง', d: 'Burn ส่วนตัวลด 30% แต่ชีวิตส่วนตัวแย่ลง', fx: function () { s.founder.burn = Math.round(s.founder.burn * 0.7); H.life(s, -10); return 'ค่าใช้จ่ายส่วนตัวลดเหลือ ' + F.b(s.founder.burn) + '/เดือน'; } }
      ];
    }
  });

  E.register({
    id: 'term_sheet', cat: 'funding',
    valid: function (s, d) { return !!RW.Funding.findTS(s, d.ts); },
    title: function (s, d) { var ts = RW.Funding.findTS(s, d.ts); var inv = s.funding.investors.find(function (i) { return i.id === ts.invId; }); return (d.final ? 'ข้อเสนอสุดท้ายจาก ' : (ts.kind === 'priced' ? 'Term Sheet จาก ' : 'ข้อเสนอลงทุนจาก ')) + inv.name; },
    body: function (s, d) {
      var ts = RW.Funding.findTS(s, d.ts);
      var inv = s.funding.investors.find(function (i) { return i.id === ts.invId; });
      var fd = RW.Funding.fullyDiluted(s);
      var lines = [];
      if (ts.kind === 'safe') {
        var pct = ts.amount / ts.cap;
        lines.push('เครื่องมือ: SAFE (post-money)', 'จำนวนเงิน: ' + F.b(ts.amount), 'Valuation cap: ' + F.m(ts.cap) + ' · ส่วนลด ' + F.pct(ts.discount, 0), 'สัดส่วนโดยประมาณเมื่อแปลงเป็นหุ้น: ~' + F.pct(pct, 2));
      } else if (ts.kind === 'accelerator') {
        lines.push('โปรแกรม Accelerator 12 สัปดาห์', 'เงินลงทุน: ' + F.b(ts.amount) + (ts.fixedPct ? ' แลกหุ้น ' + F.pct(ts.fixedPct, 0) : ' (ไม่เอาหุ้น — แต่ต้องทำ POC กับธนาคาร)'), 'ระหว่างโปรแกรม คุณต้องเข้าเวิร์กช็อปทุกสัปดาห์ (เวลาทำงานลด ~15%)', 'จบด้วย Demo Day ต่อหน้านักลงทุน 100+ ราย');
      } else {
        var post = ts.pre + ts.amount;
        lines.push('Lead investor: ' + inv.name, 'เงินลงทุนจาก Lead: ' + F.b(ts.amount) + ' (เป้ารอบ ' + F.m(s.funding.raise.target) + ')', 'Pre-money valuation: ' + F.m(ts.pre) + ' → Post-money ~' + F.m(post + Math.max(0, s.funding.raise.target - ts.amount)),
          'Liquidation preference: ' + RW.TERMS.pref[ts.pref], 'Anti-dilution: ' + RW.TERMS.anti[ts.anti],
          'Option pool: ต้องมี ' + F.pct(ts.poolPct, 0) + ' ของ post-money (สร้างก่อนเงินเข้า = ผู้ถือหุ้นเดิมโดนลด)',
          ts.boardSeat ? 'ขอที่นั่งในบอร์ด 1 ที่นั่ง' : 'ไม่ขอที่นั่งบอร์ด', ts.founderVesting ? 'ผู้ก่อตั้งต้อง re-vest หุ้น 4 ปี (founder vesting)' : '', ts.flip ? 'เงื่อนไข: ย้ายโครงสร้าง Holding ไปสิงคโปร์ (ค่าทนายเพิ่ม ~2 เท่า)' : '');
      }
      lines.push('', 'ประวัติ: ' + inv.bio + ' · ชื่อเสียงในวงการ ' + inv.rep + '/100 · ความเป็นมิตรต่อผู้ก่อตั้ง ' + inv.friendly + '/100', 'ข้อเสนอหมดอายุ ' + RW.T.label(ts.expires));
      return lines.filter(function (x) { return x !== ''; }).join('\n');
    },
    choices: function (s, d) {
      var ts = RW.Funding.findTS(s, d.ts);
      var base = ts.kind === 'priced' ? ts.pre : ts.cap;
      var out = [{ t: 'ตอบรับ', d: ts.kind === 'priced' ? 'ล็อก Lead แล้วหานักลงทุนร่วม' : 'เงินเข้าทันที', fx: function () { return RW.Funding.respondTS(s, d.ts, 'accept').msg; } }];
      if (!d.final && ts.kind !== 'accelerator') {
        out.push({ t: 'ต่อรองราคา +20% (' + F.m(base * 1.2) + ')', d: 'อาจได้ อาจเจอข้อเสนอกลับ หรืออาจเสียดีล', fx: function () { return RW.Funding.respondTS(s, d.ts, 'counter', Math.round(base * 1.2 / 1e5) * 1e5).msg; } });
        out.push({ t: 'ต่อรองเบาๆ +8% (' + F.m(base * 1.08) + ')', d: 'เสี่ยงน้อยกว่า', fx: function () { return RW.Funding.respondTS(s, d.ts, 'counter', Math.round(base * 1.08 / 1e5) * 1e5).msg; } });
      }
      out.push({ t: 'ปฏิเสธ', d: 'รอข้อเสนอที่ดีกว่า', fx: function () { return RW.Funding.respondTS(s, d.ts, 'decline').msg; } });
      return out;
    }
  });

  E.register({
    id: 'dd_check', cat: 'funding',
    valid: function (s) { return s.funding.raise && s.funding.raise.status === 'closing'; },
    title: 'Due Diligence พบประเด็น',
    body: function (s) {
      var issues = E.ddIssues(s);
      if (!issues.length) return 'ทีมทนายและผู้ตรวจสอบของนักลงทุนตรวจเอกสารครบถ้วน ไม่พบประเด็นสำคัญ บัญชีสะอาด สัญญาเรียบร้อย';
      return 'ทีม DD ของนักลงทุนพบประเด็นดังนี้:\n• ' + issues.map(function (i) { return i.t; }).join('\n• ') + '\n\nLead investor ขอให้แก้ไขก่อนเซ็นสัญญา และอาจขอปรับราคาลง';
    },
    choices: function (s) {
      var issues = E.ddIssues(s);
      if (!issues.length) return [{ t: 'เยี่ยม เดินหน้าปิดรอบ', fx: function () { return 'DD ผ่าน'; } }];
      var sev = U.sum(issues, function (i) { return i.sev; });
      return [
        { t: 'จ้างที่ปรึกษาแก้ไขทั้งหมด (' + F.m(sev * 120000) + ')', d: 'ปิดรอบตามเดิม ช้าลง 2 สัปดาห์', fx: function () { L.spend(s.fin, 'prof', sev * 120000); s.funding.raise.closingW += 2; issues.forEach(function (i) { if (i.fix) i.fix(); }); return 'แก้ไขเรียบร้อย นักลงทุนพอใจ'; } },
        { t: 'ยอมให้ลดราคา pre-money ' + Math.min(25, sev * 5) + '%', d: 'ไม่ต้องแก้ แต่โดน dilute มากขึ้น', fx: function () { var r = s.funding.raise; r.leadTerms.pre = Math.round(r.leadTerms.pre * (1 - Math.min(0.25, sev * 0.05)) / 1e5) * 1e5; return 'Pre-money ใหม่: ' + F.m(r.leadTerms.pre); } },
        { t: 'ยืนกราน — ปัญหาเล็กน้อย', d: 'เสี่ยงนักลงทุนถอนตัว', fx: function () { if (R.chance(0.25 + sev * 0.1)) { var lead = s.funding.investors.find(function (i) { return i.id === s.funding.raise.leadId; }); lead.passedUntil = s.time.w + 52; s.funding.raise = null; RW.Team.addMod(s, -10, 12, 'ดีลระดมทุนล่มในนาทีสุดท้าย'); s.flags.failedRaiseW = s.time.w; return 'Lead investor ถอนตัว! รอบนี้ล่มทั้งรอบ'; } return 'นักลงทุนยอมเดินหน้าต่อ แต่ความเชื่อมั่นลดลง'; } }
      ];
    }
  });
  E.ddIssues = function (s) {
    var out = [];
    if (!s.company.registered) out.push({ t: 'บริษัทยังไม่ได้จดทะเบียนอย่างถูกต้อง', sev: 3, fix: function () { s.company.registered = true; } });
    if (s.flags.ipNotAssigned) out.push({ t: 'โค้ด/ทรัพย์สินทางปัญญาบางส่วนยังเป็นชื่อบุคคล ไม่ได้โอนเข้าบริษัท', sev: 2, fix: function () { s.flags.ipNotAssigned = 0; } });
    if (s.flags.booksMessy) out.push({ t: 'บัญชีไม่เป็นระเบียบ ไม่มีงบตรวจสอบ', sev: 2, fix: function () { s.flags.booksMessy = 0; } });
    if (s.flags.fraudRisk) out.push({ t: 'การรับรู้รายได้ไม่สอดคล้องมาตรฐานบัญชี (ตัวเลขที่ใช้พิตช์สูงเกินจริง)', sev: 5, fix: function () { s.flags.fraudRisk = 0; } });
    if (s.flags.cofounderLeftUnvested) out.push({ t: 'อดีตผู้ร่วมก่อตั้งที่ลาออกยังถือหุ้นจำนวนมาก (dead equity)', sev: 3, fix: function () { s.flags.cofounderLeftUnvested = 0; } });
    if (s.flags.lawsuit) out.push({ t: 'มีคดีความค้างอยู่', sev: 2 });
    if (s.flags.pdpaHidden) out.push({ t: 'พบหลักฐานว่าเคยปกปิดเหตุข้อมูลรั่วไหล', sev: 5 });
    if (!s.flags.vatOk && s.fin.vat.required && !s.fin.vat.registered) out.push({ t: 'รายได้เกิน 1.8 ล้าน แต่ยังไม่จด VAT', sev: 2, fix: function () { s.fin.vat.registered = true; } });
    return out;
  };

  E.register({
    id: 'board_pressure', cat: 'funding',
    title: 'บอร์ดกดดันให้เปลี่ยนแผน',
    body: function (s) { return 'ในการประชุมบอร์ด นักลงทุนแสดงความไม่พอใจกับผลประกอบการ ความเชื่อมั่นเหลือ ' + Math.round(s.funding.board.confidence) + '/100\n\n"เราต้องการเห็นแผนที่ชัดเจนว่าบริษัทจะไปถึงจุดคุ้มทุนหรือรอบถัดไปได้อย่างไร"'; },
    choices: function (s) {
      return [
        { t: 'สัญญาลด burn 25% ภายในไตรมาสหน้า', d: 'ต้องลดคนหรือลดงบการตลาดจริง (บอร์ดจะตรวจ)', fx: function () { s.flags.burnPromise = { w: s.time.w + 13, burn: s.kpi.burn * 0.75 }; s.funding.board.confidence += 10; return 'บอร์ดรับแผน — ไตรมาสหน้าจะตรวจผล'; } },
        { t: 'ขอจ้าง COO/CFO มืออาชีพตามที่บอร์ดแนะนำ', d: 'เพิ่มต้นทุน แต่บอร์ดเชื่อมั่นขึ้น', fx: function () { s.funding.board.confidence += 14; s.flags.boardWantsExec = s.time.w; return 'บอร์ดพอใจ — ไปเปิดรับสมัครตำแหน่งผู้บริหาร (ระดับ 5) ในหน้าทีมงาน'; } },
        { t: 'ยืนยันกลยุทธ์เดิม อธิบายด้วยข้อมูล', d: 'ใช้ทักษะพิตช์ของคุณ', fx: function () { var p = U.clamp((s.founder.skills.pitch - 30) / 60, 0.1, 0.85); if (R.chance(p)) { s.funding.board.confidence += 12; return 'คุณโน้มน้าวบอร์ดได้สำเร็จ'; } s.funding.board.confidence -= 8; return 'บอร์ดไม่เชื่อ ความสัมพันธ์แย่ลง'; } }
      ];
    }
  });
  E.effect('burn_check', function () { });

  E.register({
    id: 'ceo_replace', cat: 'funding',
    title: 'บอร์ดลงมติเปลี่ยนตัว CEO',
    body: function (s) { return 'นักลงทุนถือที่นั่งบอร์ดเสียงข้างมาก และผลประกอบการต่ำกว่าเป้าหมายมาหลายไตรมาส บอร์ดเรียกประชุมวาระพิเศษเพื่อสรรหา CEO คนใหม่จากภายนอก\n\nคุณยังเป็นผู้ถือหุ้น แต่จะไม่ได้กุมบังเหียนบริษัทอีกต่อไป'; },
    choices: function (s) {
      var hasAlly = (s.cofounders || []).some(function (c) { return c.active; }) || s.funding.relations > 70;
      return [
        { t: 'ยอมรับ ถอยไปเป็น Chief Product Officer', d: 'เกมจบในฐานะผู้ก่อตั้ง (คะแนนคิดจากหุ้นที่ถือ)', fx: function () { RW.Engine.gameOver(s, 'fired', 'บอร์ดเปลี่ยนตัว CEO — คุณถอยไปเป็นผู้บริหารระดับรอง'); return 'จบเกม'; } },
        { t: 'สู้ในที่ประชุม ขอเวลาอีก 2 ไตรมาส', d: hasAlly ? 'คุณมีพันธมิตรในบอร์ด' : 'โอกาสน้อย — ไม่มีพันธมิตร', fx: function () {
          if (R.chance(hasAlly ? 0.55 : 0.2)) { s.funding.board.confidence = 40; s.funding.board.lowQuarters = 0; return 'บอร์ดให้โอกาสอีกครั้ง — นี่คือโอกาสสุดท้าย'; }
          RW.Engine.gameOver(s, 'fired', 'แพ้โหวตในบอร์ด ถูกปลดจากตำแหน่ง CEO'); return 'จบเกม'; } }
      ];
    }
  });

  E.register({
    id: 'cofounder_leaving', cat: 'founder',
    valid: function (s, d) { var c = (s.cofounders || []).find(function (x) { return x.id === d.cf; }); return c && c.active; },
    title: function (s, d) { var c = s.cofounders.find(function (x) { return x.id === d.cf; }); return 'ผู้ร่วมก่อตั้ง ' + c.name + ' ต้องการลาออก'; },
    body: function (s, d) {
      var c = s.cofounders.find(function (x) { return x.id === d.cf; });
      var h = RW.Funding.holder(s, c.id);
      var vested = E.cofounderVested(s, c);
      return c.name + ' บอกว่าเหนื่อยและไม่เห็นทางไปต่อ ' + (c.conflict > 50 ? 'และไม่อยากทำงานกับคุณอีกแล้ว' : 'อยากกลับไปมีชีวิตที่มั่นคง') + '\n\nถือหุ้นอยู่ ' + F.pct(h.shares / RW.Funding.fullyDiluted(s)) + (s.flags.cofounderVesting ? ' — vest แล้ว ' + F.pct(vested, 0) + ' ของหุ้นที่ได้' : ' — ไม่มีเงื่อนไข vesting! เขาจะเอาหุ้นไปทั้งหมด');
    },
    choices: function (s, d) {
      var c = s.cofounders.find(function (x) { return x.id === d.cf; });
      return [
        { t: 'ขอให้อยู่ต่อ ปรับเงินเดือนเป็นตลาด', d: 'ต้นทุนเพิ่ม', fx: function () { var mk = RW.ROLES[c.role].salary[4]; if (R.chance(0.55)) { c.salary = mk; c.morale = 70; c.conflict *= 0.6; return c.name + ' ตกลงอยู่ต่อ'; } E.cofounderLeave(s, c); return c.name + ' ยืนยันจะไป'; } },
        { t: 'พักงาน 1 เดือนแล้วค่อยคุยกันใหม่', d: 'ขาดกำลังสำคัญชั่วคราว', fx: function () { c.active = false; E.later(s, 4, 'cofounder_return', { cf: c.id }); return c.name + ' หยุดพัก 4 สัปดาห์'; } },
        { t: 'ปล่อยไป', d: 'ต้องหาคนมาแทน', fx: function () { E.cofounderLeave(s, c); return c.name + ' ออกจากบริษัทแล้ว'; } }
      ];
    }
  });
  E.effect('cofounder_return', function (s, d) {
    var c = s.cofounders.find(function (x) { return x.id === d.cf; });
    if (!c) return;
    if (R.chance(0.6)) { c.active = true; c.morale = 65; c.conflict *= 0.5; H.mail(s, c.name + ' กลับมาทำงานแล้ว', 'หลังได้พักผ่อน ไฟกลับมาอีกครั้ง', 'good'); }
    else { c.active = true; E.cofounderLeave(s, c); H.mail(s, c.name + ' ตัดสินใจไม่กลับมา', 'ผู้ร่วมก่อตั้งออกจากบริษัทอย่างถาวร', 'bad'); }
  });
  E.cofounderVested = function (s, c) {
    if (!s.flags.cofounderVesting) return 1;
    var t = s.time.w - c.joinW;
    return t < 52 ? 0 : Math.min(1, t / 208);
  };
  E.cofounderLeave = function (s, c) {
    c.active = false; c.left = s.time.w;
    var h = RW.Funding.holder(s, c.id);
    if (h) {
      var vested = E.cofounderVested(s, c);
      var back = Math.round(h.shares * (1 - vested));
      if (back > 0) { h.shares -= back; s.funding.pool += back; }
      h.name = c.name + ' (อดีตผู้ร่วมก่อตั้ง)';
      if (h.shares / RW.Funding.fullyDiluted(s) > 0.12) s.flags.cofounderLeftUnvested = 1;
    }
    H.morale(s, -8, 16, 'ผู้ร่วมก่อตั้งลาออก');
    H.stress(s, 12);
    s.founder.rep = Math.max(0, s.founder.rep - 3);
  };

  E.register({
    id: 'cofounder_conflict', cat: 'founder',
    valid: function (s, d) { var c = (s.cofounders || []).find(function (x) { return x.id === d.cf; }); return c && c.active; },
    title: function (s, d) { var c = s.cofounders.find(function (x) { return x.id === d.cf; }); return 'ขัดแย้งรุนแรงกับ ' + c.name; },
    body: function (s, d) { var c = s.cofounders.find(function (x) { return x.id === d.cf; }); return c.name + ' ไม่เห็นด้วยกับทิศทางบริษัทอย่างแรง ' + R.pick(['ต้องการเปลี่ยนกลุ่มลูกค้าเป้าหมาย', 'มองว่าคุณใช้เงินเปลืองเกินไป', 'ต้องการเป็น CEO ร่วม', 'ไม่พอใจที่คุณตัดสินใจเรื่องใหญ่โดยไม่ปรึกษา']) + ' การทะเลาะเริ่มเกิดต่อหน้าทีม'; },
    choices: function (s, d) {
      var c = s.cofounders.find(function (x) { return x.id === d.cf; });
      return [
        { t: 'จ้าง executive coach มาไกล่เกลี่ย (฿80,000)', d: 'ลดความขัดแย้งได้มาก', fx: function () { L.spend(s.fin, 'prof', 80000); c.conflict *= 0.4; return 'บรรยากาศดีขึ้น ทั้งคู่ตกลงกติกาการตัดสินใจกันได้'; } },
        { t: 'ยอมตามความเห็นของ ' + c.name, d: 'รักษาความสัมพันธ์ แต่คุณอาจไม่เห็นด้วย', fx: function () { c.conflict *= 0.55; c.morale += 10; H.stress(s, 4); return c.name + ' พอใจ'; } },
        { t: 'ใช้อำนาจ CEO ตัดสิน', d: 'จบเร็ว แต่บาดหมาง', fx: function () { c.conflict = Math.min(100, c.conflict + 10); c.morale -= 15; H.morale(s, -3, 8, 'ทีมเห็นผู้ก่อตั้งทะเลาะกัน'); return 'การตัดสินใจจบ แต่ ' + c.name + ' ไม่พอใจอย่างชัดเจน'; } }
      ];
    }
  });

  E.register({
    id: 'acq_offer', cat: 'funding',
    valid: function (s, d) { return s.funding.offers.some(function (o) { return o.id === d.offer; }); },
    title: function (s, d) { var o = s.funding.offers.find(function (x) { return x.id === d.offer; }); return 'ข้อเสนอซื้อกิจการจาก ' + o.buyer; },
    body: function (s, d) {
      var o = s.funding.offers.find(function (x) { return x.id === d.offer; });
      var wf = RW.Funding.waterfall(s, o.price);
      var kinds = { strategic: 'Strategic acquisition — ต้องการผนวกธุรกิจคุณเข้ากับของเขา', pe: 'Private Equity buyout — ซื้อเพื่อบริหารให้มีกำไรแล้วขายต่อ', acquihire: 'Acqui-hire — สนใจทีมมากกว่าธุรกิจ' };
      return kinds[o.kind] + '\n\nมูลค่ากิจการ: ' + F.m(o.price) + '\nจ่ายเป็นเงินสด ' + F.pct(o.cash, 0) + (o.cash < 1 ? ' ที่เหลือเป็นหุ้นของผู้ซื้อ' : '') + (o.earnout ? '\nEarn-out ' + F.pct(o.earnout, 0) + ' จ่ายเมื่อทำเป้าได้ใน 2 ปี' : '') + '\nคุณต้องอยู่ทำงานต่อ ' + o.retention + ' ปี\n\nตามลำดับสิทธิ์ (liquidation waterfall) คุณจะได้รับประมาณ ' + F.m(wf.founder) + ' (' + F.pct(wf.founder / o.price) + ' ของดีล)' + (s.flags.rofr ? '\n\n⚠ นักลงทุน CVC มีสิทธิ์ ROFR — อาจขอซื้อตัดหน้าหรือขวางดีล' : '');
    },
    choices: function (s, d) {
      var o = s.funding.offers.find(function (x) { return x.id === d.offer; });
      var ctrl = RW.Funding.investorControl(s);
      var wf = RW.Funding.waterfall(s, o.price);
      var invOK = U.sum(wf.holders.filter(function (h) { return h.kind === 'investor'; }), function (h) { return h.amount; }) >= U.sum(s.funding.holders.filter(function (h) { return h.kind === 'investor'; }), function (h) { return h.invested || 0; }) * 1.5;
      return [
        { t: 'ขายบริษัท', d: ctrl && !invOK ? 'บอร์ด (นักลงทุนคุมเสียงข้างมาก) อาจไม่อนุมัติ — ผลตอบแทนเขาต่ำ' : 'จบเกมด้วยการ Exit', fx: function () {
          if (ctrl && !invOK && R.chance(0.65)) { s.funding.offers = s.funding.offers.filter(function (x) { return x.id !== o.id; }); return 'บอร์ดไม่อนุมัติ — นักลงทุนต้องการผลตอบแทนอย่างน้อย 1.5 เท่า'; }
          RW.Engine.exit(s, 'acquired', o); return 'ขายกิจการสำเร็จ'; } },
        { t: 'ต่อรองราคาขึ้น 25%', d: 'ผู้ซื้ออาจถอย', fx: function () { if (R.chance(0.45)) { o.price = Math.round(o.price * 1.25 / 1e6) * 1e6; o.expires = s.time.w + 3; E.queue(s, 'acq_offer', { offer: o.id }, s.time.w + 1); return o.buyer + ' ยอมขึ้นราคาเป็น ' + F.m(o.price) + ' — กำลังส่งข้อเสนอใหม่'; } s.funding.offers = s.funding.offers.filter(function (x) { return x.id !== o.id; }); return o.buyer + ' ถอนข้อเสนอ'; } },
        { t: 'ปฏิเสธ — เราจะไปให้ไกลกว่านี้', d: 'ข่าวการปฏิเสธช่วยให้ทีมฮึกเหิม', fx: function () { s.funding.offers = s.funding.offers.filter(function (x) { return x.id !== o.id; }); H.morale(s, 3, 8, 'ผู้ก่อตั้งปฏิเสธข้อเสนอซื้อกิจการ'); return 'ปฏิเสธข้อเสนอแล้ว'; } }
      ];
    }
  });

  E.register({
    id: 'vat_register', cat: 'admin',
    title: 'รายได้เกิน 1.8 ล้านบาท — ต้องจดทะเบียน VAT',
    body: function (s) { var M = H.M(s); return 'ตามประมวลรัษฎากร เมื่อรายได้เกิน 1.8 ล้านบาทต่อปี ต้องจดทะเบียนภาษีมูลค่าเพิ่มภายใน 30 วัน\n\n' + (M.b2c ? 'ธุรกิจคุณขายผู้บริโภค ราคาที่ลูกค้าจ่ายรวม VAT แล้ว — ถ้าไม่ขึ้นราคา รายได้สุทธิจะหายไป 6.5% ทันที' : 'ลูกค้าธุรกิจนำ VAT ไปเครดิตได้ ผลกระทบต่อราคาต่ำ แต่มีงานเอกสารเพิ่ม (ภ.พ.30 ทุกเดือน)'); },
    choices: function (s) {
      return [
        { t: 'จดทะเบียนทันที (จ้างสำนักงานบัญชีเพิ่ม ฿4,000/เดือน)', fx: function () { s.fin.vat.registered = true; s.flags.vatOk = 1; s.company.extraAdmin = (s.company.extraAdmin || 0) + 4000; return 'จด VAT เรียบร้อย'; } },
        { t: 'ยังไม่จด รอดูก่อน', d: 'ถ้าสรรพากรตรวจเจอ ค่าปรับ + เงินเพิ่มย้อนหลัง', fx: function () { s.fin.vat.dodgeW = s.time.w; E.later(s, R.int(20, 60), 'vat_caught', {}); return 'คุณเลือกเสี่ยง'; } }
      ];
    }
  });
  E.effect('vat_caught', function (s) {
    if (s.fin.vat.registered) return;
    if (!R.chance(0.55)) return;
    var M = RW.Models[s.industry];
    var months = Math.max(1, Math.round((s.time.w - (s.fin.vat.dodgeW || s.time.w)) / 4.33));
    var rev = (s.kpi.revenueMonthly || 0) * months;
    var pen = Math.round(rev * 0.07 * 2 + 20000);
    L.spend(s.fin, 'penalties', pen);
    s.fin.vat.registered = true;
    H.mail(s, 'สรรพากรตรวจพบไม่จด VAT', 'ต้องชำระภาษีย้อนหลังพร้อมเบี้ยปรับและเงินเพิ่ม ' + F.b(pen), 'bad');
  });

  // =====================================================================
  //  RANDOM EVENTS — TEAM
  // =====================================================================
  E.register({
    id: 'raise_request', cat: 'team', weight: 2, cooldown: 10,
    cond: function (s) { return RW.Team.active(s).length >= 2; },
    init: function (s) {
      var e = H.pickEmp(s, function (e) { return s.time.w - e.lastRaiseW > 30 && e.salary < RW.Team.marketSalary(s, e.role, e.level, e.skill) * 1.05; });
      return e ? { emp: e.id } : null;
    },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: function (s, d) { return H.emp(s, d.emp).name + ' ขอขึ้นเงินเดือน'; },
    body: function (s, d) { var e = H.emp(s, d.emp); var mk = RW.Team.marketSalary(s, e.role, e.level, e.skill); return e.nick + ' (' + RW.ROLES[e.role].n + ') ขอเข้าพบเป็นการส่วนตัว "ผมทำงานหนักมาตลอด และรู้ว่าตลาดจ่ายตำแหน่งนี้สูงกว่านี้"\n\nเงินเดือนปัจจุบัน ' + F.b(e.salary) + ' · ราคาตลาด ~' + F.b(mk) + ' · ขอ +15%'; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'ให้ตามขอ +15%', fx: function () { RW.Team.giveRaise(s, e.id, 0.15); return e.nick + ' ขอบคุณมาก ทำงานด้วยไฟเต็มที่'; } },
        { t: 'ให้ครึ่งทาง +7%', fx: function () { RW.Team.giveRaise(s, e.id, 0.07); e.morale -= 5; return e.nick + ' รับไว้แต่ดูไม่ค่อยพอใจ'; } },
        { t: 'ปฏิเสธ — ยังไม่ถึงรอบประเมิน', fx: function () { e.morale -= 18; return e.nick + ' เดินออกจากห้องเงียบๆ... เริ่มเปิด LinkedIn บ่อยขึ้น'; } }
      ];
    }
  });

  E.register({
    id: 'toxic_complaint', cat: 'team', weight: 3, cooldown: 20,
    cond: function (s) { return RW.Team.active(s).some(function (e) { return e.traits.indexOf('toxic') >= 0 && s.time.w - e.startW > 4; }); },
    init: function (s) { var e = H.pickEmp(s, function (e) { return e.traits.indexOf('toxic') >= 0; }); return e ? { emp: e.id } : null; },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: 'เรื่องร้องเรียนจากทีม',
    body: function (s, d) { var e = H.emp(s, d.emp); return 'พนักงาน 3 คนมาพบคุณพร้อมกัน ร้องเรียนว่า ' + e.name + ' (' + RW.ROLES[e.role].n + ') ชอบพูดจาดูถูก โยนความผิด และเอาผลงานคนอื่นไปเป็นของตัวเอง\n\nปัญหาคือ ' + e.nick + ' ทำงานเก่งและผลงานจับต้องได้ชัดเจน'; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'เลิกจ้าง (จ่ายค่าชดเชยตามกฎหมาย ~' + F.b(RW.Team.severanceCost(s, e)) + ')', fx: function () { if (e.known.indexOf('toxic') < 0) e.known.push('toxic'); RW.Team.fire(s, e.id); return 'ทีมโล่งใจ บรรยากาศดีขึ้นอย่างเห็นได้ชัด'; } },
        { t: 'ตักเตือนเป็นลายลักษณ์อักษร + ส่งโค้ช', d: '฿45,000 อาจได้ผลหรือไม่ก็ได้', fx: function () { L.spend(s.fin, 'culture', 45000); if (e.known.indexOf('toxic') < 0) e.known.push('toxic'); if (R.chance(0.4)) { e.traits = e.traits.filter(function (t) { return t !== 'toxic'; }); e.known = e.known.filter(function (t) { return t !== 'toxic'; }); return e.nick + ' ปรับตัวได้จริง'; } return 'ดีขึ้นช่วงสั้นๆ แล้วกลับเป็นเหมือนเดิม'; } },
        { t: 'ไม่ทำอะไร — ผลงานสำคัญกว่า', fx: function () { H.morale(s, -7, 20, 'ผู้บริหารปล่อยให้คนเป็นพิษลอยนวล'); if (e.known.indexOf('toxic') < 0) e.known.push('toxic'); return 'คนที่ร้องเรียนผิดหวังกับคุณ'; } }
      ];
    }
  });

  E.register({
    id: 'harassment', cat: 'team', weight: 0.8, cooldown: 60, bad: true,
    cond: function (s) { return RW.Team.active(s).length >= 8; },
    init: function (s) { var e = H.pickEmp(s, function (e) { return e.level >= 3; }); return e ? { emp: e.id } : null; },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: 'ข้อร้องเรียนเรื่องการคุกคามทางเพศ',
    body: function (s, d) { var e = H.emp(s, d.emp); return 'พนักงานหญิงคนหนึ่งยื่นเรื่องร้องเรียนว่าถูก ' + e.name + ' (' + RW.ROLES[e.role].n + ' ระดับ' + RW.LEVELS[e.level] + ') คุกคามทางเพศทั้งทางวาจาและข้อความส่วนตัว มีหลักฐานแชทบางส่วน\n\nบริษัทยังไม่มีนโยบายหรือกระบวนการรองรับเรื่องนี้'; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'จ้าง HR ภายนอกสอบสวนอย่างเป็นธรรม (฿120,000)', d: 'ถูกต้องตามหลัก', fx: function () { L.spend(s.fin, 'prof', 120000); if (R.chance(0.7)) { RW.Team.fire(s, e.id); H.morale(s, 4, 12, 'บริษัทจัดการเรื่องร้องเรียนอย่างจริงจัง'); return 'ผลสอบสวนพบมีมูลจริง เลิกจ้างแล้ว ทีมรู้สึกปลอดภัยขึ้น'; } H.morale(s, 1, 6, ''); return 'หลักฐานไม่เพียงพอ ทั้งสองฝ่ายยอมรับกระบวนการ'; } },
        { t: 'ย้ายผู้ร้องเรียนไปทีมอื่นเงียบๆ', fx: function () { E.later(s, R.int(8, 30), 'harass_leak', { emp: e.id }); return 'เรื่องเงียบไปชั่วคราว'; } },
        { t: 'ไม่ดำเนินการ — "เรื่องส่วนตัว"', fx: function () { E.later(s, R.int(4, 20), 'harass_leak', { emp: e.id, worse: 1 }); H.morale(s, -5, 16, ''); return 'ผู้ร้องเรียนลาออกในเดือนถัดมา'; } }
      ];
    }
  });
  E.effect('harass_leak', function (s, d) {
    if (!R.chance(d.worse ? 0.7 : 0.45)) return;
    H.rep(s, -12); H.brand(s, -10); H.morale(s, -12, 20, 'ข่าวฉาวในบริษัท');
    s.team.brand = Math.max(0, s.team.brand - 15);
    H.mail(s, 'ข่าวฉาวหลุดสู่โซเชียล', 'อดีตพนักงานโพสต์เรื่องการคุกคามทางเพศในบริษัทพร้อมหลักฐาน ยอดแชร์หลายหมื่น นักข่าวโทรมาขอสัมภาษณ์ ภาพลักษณ์บริษัทและผู้ก่อตั้งเสียหายหนัก', 'bad');
  });

  E.register({
    id: 'poach_team', cat: 'team', weight: 1.5, cooldown: 30, bad: true,
    cond: function (s) { return RW.Team.active(s).filter(function (e) { return e.skill > 70; }).length >= 2 && RW.World.aliveCompetitors(s).length > 0; },
    init: function (s) { var c = R.pick(RW.World.aliveCompetitors(s)); var es = RW.Team.active(s).filter(function (e) { return e.skill > 70; }).slice(0, 3); return { comp: c.name, emps: es.map(function (e) { return e.id; }) }; },
    title: function (s, d) { return d.comp + ' กำลังซื้อตัวคนเก่งของคุณ'; },
    body: function (s, d) { var names = d.emps.map(function (id) { var e = H.emp(s, id); return e ? e.name : ''; }).filter(Boolean); return 'มีข่าวว่า ' + d.comp + ' ติดต่อ ' + names.join(', ') + ' เสนอเงินเดือนสูงกว่า 40% พร้อมหุ้น'; },
    choices: function (s, d) {
      var es = d.emps.map(function (id) { return H.emp(s, id); }).filter(function (e) { return e && !e.gone; });
      return [
        { t: 'ขึ้นเงินเดือนเชิงป้องกัน +15% ทุกคน', fx: function () { es.forEach(function (e) { RW.Team.giveRaise(s, e.id, 0.15); }); return 'ทุกคนอยู่ต่อ'; } },
        { t: 'Retention bonus ก้อนละ 2 เดือน (จ่ายเมื่ออยู่ครบ 1 ปี)', fx: function () { es.forEach(function (e) { e.morale += 10; e.retention = s.time.w + 52; }); E.later(s, 52, 'retention_pay', { emps: d.emps }); return 'ทุกคนเซ็นสัญญา retention'; } },
        { t: 'ไม่ทำอะไร', fx: function () { var lost = 0; es.forEach(function (e) { if (R.chance(0.45)) { RW.Team.resign(s, e); lost++; } }); return lost ? 'มี ' + lost + ' คนยื่นใบลาออก' : 'โชคดี ไม่มีใครไป'; } }
      ];
    }
  });
  E.effect('retention_pay', function (s, d) {
    var total = 0;
    d.emps.forEach(function (id) { var e = H.emp(s, id); if (e && !e.gone) total += e.salary * 2; });
    if (total) { L.spend(s.fin, 'benefits', total); H.mail(s, 'จ่าย Retention bonus', 'จ่ายโบนัสรักษาพนักงานรวม ' + F.b(total)); }
  });

  E.register({
    id: 'team_burnout', cat: 'team', weight: 3, cooldown: 16,
    cond: function (s) { var a = RW.Team.active(s); return a.length >= 3 && U.avg(a, function (e) { return e.stress; }) > 60; },
    title: 'ทีมกำลังหมดไฟ',
    body: function (s) { var a = RW.Team.active(s); return 'ความเครียดเฉลี่ยของทีม ' + Math.round(U.avg(a, function (e) { return e.stress; })) + '/100 มีคนลาป่วยบ่อยขึ้น งานผิดพลาดมากขึ้น ' + R.pick(['มีคนร้องไห้ในห้องน้ำ', 'แชทกลุ่มเงียบผิดปกติ', 'Slack มีแต่คนบ่นตอนตีสอง']); },
    choices: function (s) {
      return [
        { t: 'หยุดทั้งบริษัท 1 สัปดาห์ (Recharge week)', d: 'สูญเสียผลงาน 1 สัปดาห์', fx: function () { RW.Team.active(s).forEach(function (e) { e.stress *= 0.4; }); s.flags.companyOff = s.time.w + 1; H.morale(s, 6, 10, 'บริษัทให้พักทั้งสัปดาห์'); return 'ทุกคนได้พัก กลับมาสดชื่น'; } },
        { t: 'เปลี่ยนนโยบายเป็นเลิกงานตรงเวลา', fx: function () { s.team.policy.hours = 0; H.morale(s, 3, 8, ''); return 'ตั้งนโยบายเวลาทำงานปกติแล้ว'; } },
        { t: 'เพิ่มสวัสดิการสุขภาพจิต (ปรึกษานักจิตวิทยา ฿1,200/คน/เดือน)', fx: function () { s.team.policy.benefits = Math.min(3, s.team.policy.benefits + 1); RW.Team.active(s).forEach(function (e) { e.stress *= 0.75; }); return 'ปรับแพ็กเกจสวัสดิการขึ้นหนึ่งระดับ'; } },
        { t: 'ไม่ทำอะไร — ช่วงนี้ต้องเร่ง', fx: function () { H.morale(s, -6, 12, 'ผู้บริหารไม่สนใจความเหนื่อยล้าของทีม'); return 'ทีมทำงานต่อไปด้วยความเหนื่อยล้า'; } }
      ];
    }
  });

  E.register({
    id: 'star_candidate', cat: 'team', weight: 1, cooldown: 40,
    cond: function (s) { return s.time.w > 12 && RW.Team.headcount(s) >= 2 && s.kpi.runway > 9; },
    init: function (s) {
      var M = H.M(s);
      var roles = Object.keys(RW.ROLES).filter(function (r) { return RW.ROLES[r].ind.indexOf(s.industry) >= 0 && RW.ROLES[r].dept !== 'cogs'; });
      return { role: R.pick(roles), name: RW.Names.person(), skill: R.int(84, 95) };
    },
    title: function (s, d) { return 'คนเก่งระดับท็อปอยากร่วมงาน'; },
    body: function (s, d) { var sal = Math.round(RW.ROLES[d.role].salary[4] * 1.3 / 1000) * 1000; return d.name + ' อดีตผู้บริหารจากบริษัทเทคฯ ระดับภูมิภาค (' + RW.ROLES[d.role].n + ') ได้ยินเรื่องบริษัทคุณและสนใจร่วมงาน\n\nเรียก: เงินเดือน ' + F.b(sal) + ' + หุ้น 1% · ฝีมือระดับ ' + d.skill + '/100\n\nคนระดับนี้ยกระดับทีมได้ทั้งแผนก แต่แพงมากสำหรับบริษัทขนาดนี้'; },
    choices: function (s, d) {
      var sal = Math.round(RW.ROLES[d.role].salary[4] * 1.3 / 1000) * 1000;
      return [
        { t: 'จ้างเลย', fx: function () {
          var op = { id: 'star', role: d.role, level: 4, channel: 'referral' };
          var c = { id: 'cstar', name: d.name, nick: RW.Names.nick(), role: d.role, level: 4, skill: d.skill, est: d.skill, traits: R.chance(0.5) ? ['leader'] : ['mentor'], notice: 4, opId: 'none' };
          RW.Team.hire(s, c, sal, Math.round(RW.Funding.fullyDiluted(s) * 0.01));
          return d.name + ' จะเริ่มงานใน 4 สัปดาห์'; } },
        { t: 'ขอบคุณ แต่ยังไม่พร้อม', fx: function () { return 'อาจได้เจอกันใหม่ในอนาคต'; } }
      ];
    }
  });

  E.register({
    id: 'interns', cat: 'team', weight: 1, cooldown: 52,
    cond: function (s) { var i = RW.T.info(s.time.w); return (i.month === 4 || i.month === 5) && RW.Team.headcount(s) >= 3; },
    title: 'มหาวิทยาลัยส่งนักศึกษาฝึกงาน',
    body: 'คณะวิศวะ/บริหารฯ ของมหาวิทยาลัยชั้นนำติดต่อมา ขอส่งนักศึกษาฝึกงาน 3 คน ช่วงปิดเทอม 8 สัปดาห์ เบี้ยเลี้ยงคนละ ฿8,000/เดือน\n\nได้แรงงานราคาถูกและสร้าง employer brand แต่ต้องมีคนคอยสอน',
    choices: function (s) {
      return [
        { t: 'รับ 3 คน', fx: function () { L.spend(s.fin, 'sal_ga', 48000); s.team.brand += 4; RW.Team.active(s).slice(0, 2).forEach(function (e) { e.stress += 6; }); s.flags.interns = s.time.w + 8; return 'นักศึกษาสนุกกับงาน หนึ่งในนั้นอาจกลับมาสมัครงานจริงหลังจบ'; } },
        { t: 'ปฏิเสธ — ไม่มีเวลาสอน', fx: function () { return 'ตอบปฏิเสธอย่างสุภาพ'; } }
      ];
    }
  });

  E.register({
    id: 'side_hustle', cat: 'team', weight: 1, cooldown: 40,
    cond: function (s) { return RW.Team.active(s).length >= 4; },
    init: function (s) { var e = H.pickEmp(s, function (e) { return e.level >= 2; }); return e ? { emp: e.id } : null; },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: 'พนักงานทำธุรกิจส่วนตัวในเวลางาน',
    body: function (s, d) { var e = H.emp(s, d.emp); return 'มีคนแจ้งว่า ' + e.name + ' แอบขายของออนไลน์/รับงานฟรีแลนซ์ในเวลางาน บางครั้งใช้คอมพิวเตอร์บริษัท ผลงานช่วงนี้ลดลงเล็กน้อย'; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'คุยตรงๆ ตั้งกติกาชัดเจน', fx: function () { e.morale -= 3; return e.nick + ' ยอมรับและสัญญาว่าจะแยกให้ชัด'; } },
        { t: 'ออกหนังสือเตือน', fx: function () { e.morale -= 10; return 'ออกหนังสือเตือนแล้ว — ถ้าทำผิดซ้ำ เลิกจ้างได้โดยไม่ต้องจ่ายค่าชดเชย'; } },
        { t: 'ปล่อยไป ทุกคนก็ต้องหาเงินเพิ่ม', fx: function () { e.morale += 3; H.morale(s, -1, 8, 'กฎไม่ชัดเจน'); return 'คุณทำเป็นไม่รู้'; } }
      ];
    }
  });

  E.register({
    id: 'emp_sick', cat: 'team', weight: 0.7, cooldown: 40,
    cond: function (s) { return RW.Team.active(s).length >= 3; },
    init: function (s) { var e = H.pickEmp(s); return e ? { emp: e.id } : null; },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: 'พนักงานป่วยหนัก',
    body: function (s, d) { var e = H.emp(s, d.emp); return e.name + ' ตรวจพบโรคร้ายแรง ต้องรักษาตัวอย่างน้อย 2-3 เดือน ตามกฎหมายลาป่วยได้รับค่าจ้างไม่เกิน 30 วันต่อปี'; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'จ่ายเงินเดือนเต็มตลอดการรักษา + ช่วยค่ารักษา ฿100,000', fx: function () { L.spend(s.fin, 'benefits', 100000); e.ramp = 0; e.traits.indexOf('loyal') < 0 && e.traits.push('loyal'); e.known.push('loyal'); H.morale(s, 7, 26, 'บริษัทดูแลพนักงานที่ป่วยอย่างดี'); return 'ทั้งบริษัทเห็นว่าคุณดูแลคนจริง'; } },
        { t: 'ทำตามกฎหมาย', fx: function () { e.ramp = 0; e.morale -= 15; H.morale(s, -2, 10, ''); return 'ทำตามสิทธิ์ตามกฎหมาย'; } }
      ];
    }
  });

  E.register({
    id: 'dept_conflict', cat: 'team', weight: 1.4, cooldown: 26,
    cond: function (s) { return RW.Team.active(s).length >= 6; },
    title: 'ฝ่ายขายกับฝ่ายสินค้าทะเลาะกัน',
    body: 'ฝ่ายขายสัญญาฟีเจอร์ที่ยังไม่มีกับลูกค้ารายใหญ่เพื่อปิดดีล ฝ่ายสินค้าโกรธเพราะต้องทิ้งงานที่วางแผนไว้ ทั้งสองฝ่ายมาให้คุณตัดสิน',
    choices: function (s) {
      return [
        { t: 'เข้าข้างฝ่ายขาย — ลูกค้าคือรายได้', fx: function () { H.morale(s, -4, 10, 'ทีมสินค้ารู้สึกไม่ได้รับความเคารพ'); if (s.biz && s.biz.debt != null) s.biz.debt = Math.min(100, s.biz.debt + 6); return 'ดีลปิดได้ แต่ทีมสินค้าหงุดหงิดและหนี้ทางเทคนิคเพิ่มขึ้น'; } },
        { t: 'เข้าข้างฝ่ายสินค้า — ห้ามขายของที่ไม่มี', fx: function () { H.morale(s, -2, 8, ''); return 'ฝ่ายขายเสียดีลไป 1 ราย แต่ตั้งกติกาใหม่ได้'; } },
        { t: 'ใช้เวลานั่งไกล่เกลี่ย ทำกระบวนการ roadmap ร่วมกัน', d: 'กินเวลาคุณ', fx: function () { H.energy(s, -8); H.morale(s, 3, 12, 'ทีมมีกระบวนการทำงานร่วมกันที่ชัดเจน'); return 'ทุกฝ่ายพอใจกับกระบวนการใหม่'; } }
      ];
    }
  });

  // =====================================================================
  //  RANDOM EVENTS — FOUNDER LIFE
  // =====================================================================
  E.register({
    id: 'family_health', cat: 'founder', weight: 0.8, cooldown: 70, bad: true,
    title: 'คุณพ่อเข้าโรงพยาบาล',
    body: 'คุณพ่อมีอาการเส้นเลือดในสมองตีบ ต้องนอนโรงพยาบาลและทำกายภาพบำบัดต่อเนื่อง ครอบครัวต้องการคุณ',
    choices: function (s) {
      return [
        { t: 'หยุดงาน 2 สัปดาห์ไปดูแล', fx: function () { RW.Founder.takeVacation(s, 2); H.life(s, 12); return 'คุณอยู่ข้างครอบครัวในช่วงเวลาสำคัญ'; } },
        { t: 'จ่ายค่าโรงพยาบาลเอกชน ฿350,000 แล้วทำงานต่อ', fx: function () { H.personal(s, -350000); H.stress(s, 10); H.life(s, -5); return 'คุณพ่อได้รับการรักษาที่ดี แต่คุณรู้สึกผิดที่ไม่ได้อยู่ด้วย'; } },
        { t: 'ทำงานต่อ ให้พี่น้องดูแล', fx: function () { H.life(s, -20); H.stress(s, 8); return 'ครอบครัวผิดหวังในตัวคุณ'; } }
      ];
    }
  });

  E.register({
    id: 'partner_ultimatum', cat: 'founder', weight: 2, cooldown: 30,
    cond: function (s) { return s.founder.life < 35; },
    title: 'คนรักยื่นคำขาด',
    body: '"เราไม่ได้กินข้าวด้วยกันมาสามเดือนแล้ว คุณแต่งงานกับบริษัทหรือกับเรา?"\n\nชีวิตส่วนตัวของคุณกำลังพัง ซึ่งส่งผลต่อความเครียดและพลังงานในระยะยาว',
    choices: function (s) {
      return [
        { t: 'ลดชั่วโมงทำงานเหลือ 50 ชม./สัปดาห์', fx: function () { s.founder.hours = Math.min(s.founder.hours, 50); H.life(s, 20); return 'ความสัมพันธ์ดีขึ้น บริษัทได้เวลาคุณน้อยลง'; } },
        { t: 'พาไปเที่ยว 1 สัปดาห์ (฿80,000)', fx: function () { H.personal(s, -80000); RW.Founder.takeVacation(s, 1); H.life(s, 25); return 'ทริปที่ภูเก็ตช่วยได้มาก'; } },
        { t: 'ขอเวลาอีกนิด บริษัทกำลังสำคัญ', fx: function () { if (R.chance(0.45)) { H.life(s, -30); H.stress(s, 25); H.energy(s, -20); return 'ความสัมพันธ์จบลง คุณเสียใจมากแต่ต้องทำงานต่อ'; } H.life(s, -8); return 'เขายอมรอ... อีกครั้ง'; } }
      ];
    }
  });

  E.register({
    id: 'health_scare', cat: 'founder', weight: 3, cooldown: 26, bad: true,
    cond: function (s) { return s.founder.health < 45; },
    title: 'คุณเจ็บหน้าอกกลางดึก',
    body: 'แพทย์ห้องฉุกเฉินบอกว่าเป็นอาการจากความเครียดและพักผ่อนไม่พอ ความดันสูง น้ำหนักขึ้น 8 กิโลในปีเดียว "ถ้ายังใช้ชีวิตแบบนี้ อีกไม่กี่ปีได้เจอกันที่ ICU"',
    choices: function (s) {
      return [
        { t: 'พักฟื้น 2 สัปดาห์ แล้วจำกัดชั่วโมงทำงาน', fx: function () { RW.Founder.takeVacation(s, 2); s.founder.hours = Math.min(s.founder.hours, 55); s.founder.health = Math.min(100, s.founder.health + 25); return 'สุขภาพค่อยๆ ดีขึ้น'; } },
        { t: 'ออกกำลังกายและนอนให้พอ (ลดชั่วโมงลง 10)', fx: function () { s.founder.hours = Math.max(40, s.founder.hours - 10); s.founder.health = Math.min(100, s.founder.health + 12); return 'เริ่มวิ่งทุกเช้า'; } },
        { t: 'กินยาแล้วทำงานต่อ', fx: function () { E.later(s, R.int(6, 20), 'health_crash', {}); return 'คุณกลับไปทำงานในวันรุ่งขึ้น'; } }
      ];
    }
  });
  E.effect('health_crash', function (s) {
    if (s.founder.health > 55 || !R.chance(0.6)) return;
    RW.Founder.takeVacation(s, 6);
    s.founder.health = 60; H.personal(s, -250000);
    s.flags.crisis = s.time.w;
    H.mail(s, 'คุณล้มป่วยหนัก', 'หมดสติในออฟฟิศ ต้องนอนโรงพยาบาลและพักฟื้น 6 สัปดาห์ ค่ารักษา ฿250,000 บริษัทต้องเดินต่อโดยไม่มีคุณ', 'bad');
  });

  E.register({
    id: 'speaking_invite', cat: 'founder', weight: 1.2, cooldown: 26,
    cond: function (s) { return s.founder.rep > 15; },
    title: 'ได้รับเชิญขึ้นพูดในงานสัมมนาเทคโนโลยี',
    body: 'งานสัมมนาใหญ่ประจำปีเชิญคุณขึ้นพูด 20 นาทีเรื่อง "บทเรียนจากการสร้างธุรกิจ" ผู้ฟัง 2,000 คน รวมนักลงทุนและผู้ที่อาจมาร่วมงาน ต้องเตรียมตัวเกือบหนึ่งสัปดาห์',
    choices: function (s) {
      return [
        { t: 'รับ — เตรียมตัวอย่างดี', fx: function () { H.energy(s, -8); var ok = R.chance(0.4 + s.founder.skills.pitch / 150); if (ok) { H.rep(s, 6); s.team.brand += 5; s.funding.investors.forEach(function (i) { i.warm = Math.min(1.5, i.warm + 0.12); }); H.buzz(s, 1.15, 4); return 'ทอล์กของคุณถูกแชร์ต่อในโซเชียล!'; } H.rep(s, 2); return 'พูดได้พอใช้ ได้คอนเนคชั่นบ้าง'; } },
        { t: 'ปฏิเสธ — โฟกัสงาน', fx: function () { return 'ส่งอีเมลขอบคุณผู้จัด'; } }
      ];
    }
  });

  E.register({
    id: 'mentor_offer', cat: 'founder', weight: 0.8, cooldown: 80,
    cond: function (s) { return s.time.w > 8; },
    title: 'ผู้ก่อตั้งยูนิคอร์นเสนอเป็นที่ปรึกษา',
    body: 'ผู้ก่อตั้งบริษัทเทคฯ ที่ขายกิจการได้หลายพันล้าน เสนอเป็นที่ปรึกษาให้คุณ เจอกันเดือนละครั้ง แลกกับหุ้นที่ปรึกษา (advisor shares) 0.5% vest 2 ปี',
    choices: function (s) {
      return [
        { t: 'ตอบรับ (ให้หุ้น 0.5%)', fx: function () {
          var sh = Math.round(RW.Funding.fullyDiluted(s) * 0.005);
          RW.Funding.addHolder(s, { id: 'advisor1', name: 'ที่ปรึกษา (Advisor)', kind: 'advisor', cls: 'common', shares: sh });
          s.flags.mentor = s.time.w;
          ['leadership', 'pitch', 'finance', 'sales'].forEach(function (k) { s.founder.skills[k] = Math.min(95, s.founder.skills[k] + 4); });
          H.rep(s, 5); s.funding.investors.forEach(function (i) { i.warm = Math.min(1.5, i.warm + 0.2); });
          return 'คำแนะนำของเขาเปลี่ยนวิธีคิดคุณหลายเรื่อง และเขาแนะนำนักลงทุนให้หลายราย';
        } },
        { t: 'ปฏิเสธอย่างสุภาพ', fx: function () { return 'หุ้นทุกเปอร์เซ็นต์มีค่า'; } }
      ];
    }
  });

  E.register({
    id: 'old_boss', cat: 'founder', weight: 2, cooldown: 60,
    cond: function (s) { return s.kpi.runway < 5 && s.time.w > 20; },
    title: 'บริษัทเก่าชวนกลับไปทำงาน',
    body: function (s) { return 'อดีตหัวหน้าโทรมา "ตำแหน่ง Director ว่างอยู่ เงินเดือน ฿280,000 พร้อมโบนัส กลับมาเถอะ บริษัทคุณ runway เหลือ ' + F.months(s.kpi.runway) + ' ไม่ใช่เหรอ"'; },
    choices: function (s) {
      return [
        { t: 'ปฏิเสธ — ฉันจะสู้จนถึงที่สุด', fx: function () { H.stress(s, 3); return 'คุณวางสายแล้วกลับไปทำงานต่อ'; } },
        { t: 'ตอบรับ ปิดบริษัทอย่างมีระเบียบ', d: 'จบเกม', fx: function () { RW.Engine.gameOver(s, 'quit', 'คุณตัดสินใจกลับไปทำงานประจำ และปิดบริษัทอย่างมีระเบียบ'); return 'จบเกม'; } }
      ];
    }
  });

  // =====================================================================
  //  RANDOM EVENTS — ADMIN / LEGAL / ETHICS
  // =====================================================================
  E.register({
    id: 'tax_audit', cat: 'admin', weight: 1, cooldown: 70, bad: true,
    cond: function (s) { return s.time.w > 52 && (s.kpi.revenueTTM || 0) > 3e6; },
    title: 'สรรพากรเรียกตรวจสอบภาษี',
    body: function (s) { var q = E.booksQuality(s); return 'กรมสรรพากรออกหมายเรียกตรวจสอบภาษีย้อนหลัง 2 ปี ขอเอกสารใบกำกับภาษี สัญญา และบัญชีเงินเดือน\n\nความเรียบร้อยของบัญชีคุณตอนนี้: ' + (q > 0.7 ? 'ดี' : q > 0.4 ? 'พอใช้' : 'ไม่เป็นระเบียบ') + ' — ถ้าเอกสารไม่ครบ อาจโดนประเมินภาษีเพิ่มพร้อมเบี้ยปรับ'; },
    choices: function (s) {
      var q = E.booksQuality(s);
      var base = Math.max(80000, (s.kpi.revenueTTM || 0) * 0.02);
      return [
        { t: 'จ้างที่ปรึกษาภาษีดูแล (฿180,000)', fx: function () { L.spend(s.fin, 'prof', 180000); var pen = Math.round(base * (1 - q) * 0.5); if (pen > 0) L.spend(s.fin, 'penalties', pen); return pen > 0 ? 'จบด้วยการจ่ายเพิ่ม ' + F.b(pen) : 'ผ่านการตรวจโดยไม่มีค่าปรับ'; } },
        { t: 'จัดการเอง', d: 'ใช้เวลาคุณมาก', fx: function () { H.energy(s, -15); H.stress(s, 10); var pen = Math.round(base * (1 - q) * 1.4); if (pen > 0) L.spend(s.fin, 'penalties', pen); return pen > 0 ? 'โดนประเมินเพิ่ม ' + F.b(pen) : 'ผ่านไปได้'; } },
        { t: 'จ่าย "ค่าอำนวยความสะดวก" ให้เจ้าหน้าที่ ฿100,000', d: 'ผิดกฎหมาย', fx: function () { L.spend(s.fin, 'other_exp', 100000); s.flags.bribe = (s.flags.bribe || 0) + 1; E.later(s, R.int(20, 100), 'bribe_scandal', {}); return 'เรื่องจบเร็วผิดปกติ...'; } }
      ];
    }
  });
  E.booksQuality = function (s) {
    var q = 0.2 + RW.Team.capOf(s, 'finance') * 0.35 + (s.founder.focus.admin || 0) / 60 + (s.flags.auditor === 'big4' ? 0.25 : s.flags.auditor ? 0.1 : 0);
    if (s.flags.booksMessy) q -= 0.2;
    return U.clamp(q, 0, 1);
  };
  E.effect('bribe_scandal', function (s) {
    if (!R.chance(0.35)) return;
    H.rep(s, -20); H.brand(s, -12); L.spend(s.fin, 'penalties', 800000);
    s.flags.fraudRisk = 1;
    H.mail(s, 'ป.ป.ช. สอบสวนกรณีให้สินบนเจ้าหน้าที่', 'เจ้าหน้าที่ที่รับเงินถูกจับในคดีอื่นและซัดทอดมาถึงบริษัทคุณ ค่าทนายและค่าปรับ ฿800,000 ชื่อเสียงเสียหายหนัก นักลงทุนตั้งคำถามเรื่องธรรมาภิบาล', 'bad');
  });

  E.register({
    id: 'tea_money', cat: 'admin', weight: 1, cooldown: 60,
    cond: function (s) { return s.time.w > 6; },
    title: 'เจ้าหน้าที่ขอ "ค่าน้ำร้อนน้ำชา"',
    body: function (s) { return 'ใบอนุญาตที่บริษัทยื่นไว้' + (s.industry === 'fnb' ? ' (ใบอนุญาตจำหน่ายอาหารสาขาใหม่)' : s.industry === 'ecom' ? ' (เลขจดแจ้ง อย.)' : ' (หนังสือรับรองสำหรับยื่นประมูลงานภาครัฐ)') + ' ค้างมา 6 สัปดาห์ เจ้าหน้าที่บอกเป็นนัยว่า "ถ้าอยากเร็ว มีค่าดำเนินการพิเศษ ฿30,000"'; },
    choices: function (s) {
      return [
        { t: 'จ่าย', d: 'เร็ว แต่ผิดกฎหมาย', fx: function () { L.spend(s.fin, 'other_exp', 30000); s.flags.bribe = (s.flags.bribe || 0) + 1; if (R.chance(0.15)) E.later(s, R.int(20, 80), 'bribe_scandal', {}); H.M(s).onPermit && H.M(s).onPermit(s, true); return 'ใบอนุญาตออกในสามวัน'; } },
        { t: 'ไม่จ่าย รอตามขั้นตอน', fx: function () { H.M(s).onPermit && H.M(s).onPermit(s, false); return 'ต้องรอต่ออีกหลายสัปดาห์'; } },
        { t: 'ร้องเรียนต่อหน่วยงานต้านทุจริต', fx: function () { H.rep(s, 3); H.M(s).onPermit && H.M(s).onPermit(s, false); E.later(s, 8, 'permit_revenge', {}); return 'คุณยื่นเรื่องร้องเรียนพร้อมหลักฐาน'; } }
      ];
    }
  });
  E.effect('permit_revenge', function (s) {
    if (R.chance(0.4)) { H.mail(s, 'เอกสารถูกตีกลับ "ไม่ครบถ้วน"', 'คำขอของคุณถูกตีกลับด้วยเหตุผลทางเทคนิค ต้องยื่นใหม่ทั้งหมด', 'warn'); }
    else { H.rep(s, 4); H.mail(s, 'เจ้าหน้าที่ถูกย้าย', 'เรื่องร้องเรียนมีผล คุณได้รับคำชมจากเครือข่ายผู้ประกอบการ', 'good'); }
  });

  E.register({
    id: 'data_breach', cat: 'admin', weight: function (s) { return s.biz && s.biz.security != null ? 2.4 - s.biz.security / 50 : 0.8; }, cooldown: 52, bad: true,
    cond: function (s) { return s.time.w > 20 && (s.kpi.customers || 0) > 50; },
    title: 'ข้อมูลลูกค้ารั่วไหล',
    body: function (s) { return 'ทีมเทคนิคตรวจพบว่ามีผู้ไม่ประสงค์ดีเข้าถึงฐานข้อมูลลูกค้าประมาณ ' + F.num(Math.round((s.kpi.customers || 100) * R.range(0.3, 1))) + ' รายการ (ชื่อ อีเมล เบอร์โทร)\n\nตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) ต้องแจ้งสำนักงานคณะกรรมการฯ ภายใน 72 ชั่วโมง และแจ้งเจ้าของข้อมูลหากมีความเสี่ยงสูง'; },
    choices: function (s) {
      return [
        { t: 'แจ้งตามกฎหมายทันที + จ้างบริษัท security ตรวจสอบ (฿350,000)', fx: function () { L.spend(s.fin, 'prof', 350000); H.brand(s, -4); if (s.biz && s.biz.security != null) s.biz.security = Math.min(100, s.biz.security + 15); return 'สื่อรายงานข่าวเล็กน้อย ลูกค้าส่วนใหญ่ชื่นชมความโปร่งใส'; } },
        { t: 'แก้ช่องโหว่เงียบๆ ไม่แจ้งใคร', d: 'ผิดกฎหมาย PDPA โทษปรับสูงสุด 5 ล้านบาท', fx: function () { s.flags.pdpaHidden = 1; E.later(s, R.int(10, 60), 'pdpa_exposed', {}); return 'คุณหวังว่าจะไม่มีใครรู้'; } }
      ];
    }
  });
  E.effect('pdpa_exposed', function (s) {
    if (!R.chance(0.5)) return;
    L.spend(s.fin, 'penalties', 3000000);
    H.brand(s, -20); H.rep(s, -15);
    if (s.biz) H.buzz(s, 0.7, 12);
    H.mail(s, 'ข้อมูลรั่วถูกเปิดโปง + ค่าปรับ PDPA ฿3,000,000', 'ข้อมูลลูกค้าของคุณถูกนำไปขายใน dark web นักข่าวสืบพบว่าบริษัทรู้แต่ปกปิด คณะกรรมการฯ สั่งปรับทางปกครอง ลูกค้าจำนวนมากยกเลิก', 'bad');
  });

  E.register({
    id: 'ex_emp_lawsuit', cat: 'admin', weight: 2, cooldown: 40, bad: true,
    cond: function (s) { return s.team.history.fired + s.team.history.laidOff > 0; },
    title: 'อดีตพนักงานฟ้องศาลแรงงาน',
    body: 'อดีตพนักงานที่ถูกเลิกจ้างยื่นฟ้องศาลแรงงานว่าถูกเลิกจ้างไม่เป็นธรรม เรียกค่าเสียหาย ฿900,000 พร้อมค่าชดเชยเพิ่ม',
    choices: function (s) {
      return [
        { t: 'ไกล่เกลี่ย จ่าย ฿300,000', fx: function () { L.spend(s.fin, 'penalties', 300000); return 'ยอมความกันได้ที่ศาล'; } },
        { t: 'สู้คดี (ค่าทนาย ฿150,000)', fx: function () { L.spend(s.fin, 'prof', 150000); s.flags.lawsuit = 1; E.later(s, R.int(16, 40), 'lawsuit_verdict', { amt: 900000 }); return 'คดีจะใช้เวลาหลายเดือน'; } }
      ];
    }
  });
  E.effect('lawsuit_verdict', function (s, d) {
    s.flags.lawsuit = 0;
    if (R.chance(0.45)) { L.spend(s.fin, 'penalties', d.amt); H.mail(s, 'แพ้คดีแรงงาน', 'ศาลสั่งจ่ายค่าเสียหาย ' + F.b(d.amt), 'bad'); }
    else H.mail(s, 'ชนะคดีแรงงาน', 'ศาลยกฟ้อง เพราะบริษัทมีเอกสารการเตือนและการประเมินผลครบถ้วน', 'good');
  });

  E.register({
    id: 'trademark_troll', cat: 'admin', weight: 0.8, cooldown: 100, once: true, bad: true,
    cond: function (s) { return s.time.w > 30 && s.biz && s.biz.brand > 25; },
    title: 'มีคนอ้างสิทธิ์เครื่องหมายการค้าของคุณ',
    body: function (s) { return 'บริษัทแห่งหนึ่งส่งหนังสือทนายอ้างว่าจดเครื่องหมายการค้าชื่อคล้าย "' + s.company.name + '" ไว้ก่อน เรียกร้องให้หยุดใช้ชื่อ หรือจ่ายค่าสิทธิ์ ฿1,500,000\n\nคุณไม่เคยจดเครื่องหมายการค้าเลย'; },
    choices: function (s) {
      return [
        { t: 'จ่ายซื้อสิทธิ์ ฿1,200,000 (ต่อรอง)', fx: function () { L.spend(s.fin, 'prof', 1200000); s.flags.tmOk = 1; return 'ได้สิทธิ์ในชื่อแบรนด์อย่างสมบูรณ์'; } },
        { t: 'รีแบรนด์ชื่อใหม่ (฿400,000 + แบรนด์เสียความต่อเนื่อง)', fx: function () { L.spend(s.fin, 'mkt', 400000); H.brand(s, -12); s.flags.tmOk = 1; return 'เปลี่ยนชื่อสินค้าและโลโก้ ลูกค้าบางส่วนงง'; } },
        { t: 'สู้ — เราใช้ชื่อนี้ในทางการค้าก่อน (฿250,000)', fx: function () { L.spend(s.fin, 'prof', 250000); if (R.chance(0.5)) { s.flags.tmOk = 1; return 'ชนะ! พิสูจน์ได้ว่าใช้ก่อน'; } L.spend(s.fin, 'penalties', 800000); H.brand(s, -8); return 'แพ้คดี ต้องจ่ายค่าเสียหายและเปลี่ยนชื่อ'; } }
      ];
    }
  });

  E.register({
    id: 'insurance_broker', cat: 'admin', weight: 1, cooldown: 80,
    cond: function (s) { return !s.company.insured && RW.Team.headcount(s) >= 5; },
    title: 'โบรกเกอร์เสนอประกันภัยธุรกิจ',
    body: function (s) { return 'แพ็กเกจประกันครอบคลุม: ทรัพย์สิน/อัคคีภัย/น้ำท่วม, Cyber liability, ความรับผิดต่อบุคคลภายนอก และ D&O (คุ้มครองกรรมการ)\nเบี้ยประมาณ ' + F.b(E.insuranceCost(s)) + '/เดือน'; },
    choices: function (s) {
      return [
        { t: 'ซื้อ', fx: function () { s.company.insured = true; return 'มีประกันคุ้มครองแล้ว (คิดเบี้ยรายเดือนในหมวดค่าเบี้ยประกัน)'; } },
        { t: 'ยังไม่ซื้อ', fx: function () { return 'คุณเลือกรับความเสี่ยงเอง'; } }
      ];
    }
  });
  E.insuranceCost = function (s) {
    return Math.round((6000 + RW.Team.headcount(s) * 450 + (s.fin.bal.ppe || 0) * 0.0006 + (s.kpi.revenueMonthly || 0) * 0.004) / 100) * 100;
  };

  E.register({
    id: 'flood', cat: 'admin', weight: function (s) { var m = RW.T.info(s.time.w).month; return m >= 8 && m <= 10 ? 1.2 : 0; }, cooldown: 52, bad: true,
    cond: function (s) { return s.time.w > 20; },
    title: 'น้ำท่วมกรุงเทพฯ',
    body: function (s) { return 'ฝนตกหนักต่อเนื่องและน้ำทะเลหนุน หลายเขตน้ำท่วมสูง ' + (s.industry === 'fnb' ? 'สาขาของคุณบางแห่งน้ำเข้าร้าน ลูกค้าหาย' : s.industry === 'ecom' ? 'คลังสินค้าเสี่ยงน้ำเข้า การขนส่งล่าช้า' : 'พนักงานเดินทางลำบาก') + (s.company.insured ? '\n\nโชคดีที่คุณมีประกันภัย' : '\n\nคุณไม่มีประกันภัยทรัพย์สิน'); },
    choices: function (s) {
      var dmg = Math.round(((s.fin.bal.ppe || 0) * 0.08 + (s.fin.bal.inventory || 0) * 0.15 + 50000) / 1000) * 1000;
      return [
        { t: 'ยกของขึ้นที่สูง ทำงานจากที่บ้าน 1 สัปดาห์', fx: function () { var loss = s.company.insured ? Math.round(dmg * 0.1) : dmg; L.spend(s.fin, 'other_exp', loss); if (s.biz && s.biz.floodHit) s.biz.floodHit(s); H.M(s).onDisaster && H.M(s).onDisaster(s, 0.6); return 'ความเสียหายสุทธิ ' + F.b(loss); } },
        { t: 'เช่ารถบรรทุก + ย้ายของไปที่ปลอดภัย (฿60,000)', fx: function () { L.spend(s.fin, 'other_exp', 60000); var loss = s.company.insured ? 0 : Math.round(dmg * 0.3); L.spend(s.fin, 'other_exp', loss); H.M(s).onDisaster && H.M(s).onDisaster(s, 0.3); return 'ความเสียหายน้อยกว่าที่คาด'; } }
      ];
    }
  });

  E.register({
    id: 'govt_grant', cat: 'admin', weight: 1, cooldown: 52,
    cond: function (s) { return s.company.registered && s.time.w > 10; },
    title: 'ทุนสนับสนุนนวัตกรรมจากภาครัฐ',
    body: 'หน่วยงานรัฐเปิดรับข้อเสนอโครงการนวัตกรรม ให้ทุนให้เปล่าสูงสุด ฿1,500,000 (ไม่เสียหุ้น) แต่ต้องเขียนข้อเสนอโครงการยาว ส่งรายงานความก้าวหน้า และเบิกจ่ายตามงวด',
    choices: function (s) {
      return [
        { t: 'ยื่นขอทุน', d: 'ใช้เวลาคุณ 2-3 สัปดาห์', fx: function () { H.energy(s, -10); var p = 0.3 + s.founder.skills.finance / 300 + s.founder.rep / 300; E.later(s, R.int(8, 14), 'grant_result', { p: p }); return 'ส่งข้อเสนอแล้ว รอผลการพิจารณา'; } },
        { t: 'ไม่ยื่น เสียเวลา', fx: function () { return 'ข้ามไป'; } }
      ];
    }
  });
  E.effect('grant_result', function (s, d) {
    if (R.chance(d.p)) {
      var amt = R.pick([600000, 900000, 1200000, 1500000]);
      L.post(s.fin, { cash: amt * 0.5, rev_other: -amt * 0.5 }, 'op');
      E.later(s, 26, 'grant_tranche', { amt: amt * 0.5 });
      H.mail(s, 'ได้รับทุนนวัตกรรม ' + F.b(amt), 'งวดแรก 50% โอนเข้าบัญชีแล้ว งวดที่สองเมื่อส่งรายงานความก้าวหน้า', 'good');
    } else H.mail(s, 'ไม่ผ่านการพิจารณาทุน', 'คณะกรรมการเห็นว่าโครงการยังไม่ชัดเจนพอ');
  });
  E.effect('grant_tranche', function (s, d) {
    L.post(s.fin, { cash: d.amt, rev_other: -d.amt }, 'op');
    H.mail(s, 'ได้รับทุนงวดที่สอง', F.b(d.amt) + ' โอนเข้าบัญชีแล้ว', 'good');
  });

  E.register({
    id: 'fudge_numbers', cat: 'admin', weight: 2.5, cooldown: 70,
    cond: function (s) { return !!s.funding.raise && s.funding.raise.stage !== 'preseed'; },
    title: 'ข้อเสนอ "ปรับตัวเลข" ก่อนพิตช์',
    body: 'คนในทีมการเงินเสนอว่า "เราสามารถนับดีลที่ยังไม่เซ็นและรายได้ที่ลูกค้าแค่สัญญาว่าจะจ่าย รวมเป็นรายได้ไปเลย ตัวเลขจะดูโตกว่าความจริง 30% ทุกคนก็ทำกัน"',
    choices: function (s) {
      return [
        { t: 'ทำ — แค่ช่วงระดมทุน', d: 'Traction ดูดีขึ้นชั่วคราว แต่ถ้า DD เจอ...', fx: function () { s.flags.fraudRisk = 1; s.flags.inflate = s.time.w + 16; return 'Deck ใหม่ดูสวยขึ้นมาก'; } },
        { t: 'ไม่ — ตัวเลขต้องจริงเท่านั้น', fx: function () { H.rep(s, 1); return 'คุณยืนยันใช้ตัวเลขจริง'; } }
      ];
    }
  });

  E.register({
    id: 'bank_trouble', cat: 'admin', weight: 0.25, cooldown: 300, once: true, bad: true,
    cond: function (s) { return s.fin.bal.cash > 20e6; },
    title: 'ธนาคารที่คุณฝากเงินมีปัญหาสภาพคล่อง',
    body: function (s) { return 'มีข่าวลือว่าธนาคารขนาดกลางที่บริษัทฝากเงินไว้ ' + F.m(s.fin.bal.cash) + ' มีปัญหาหนี้เสียหนัก คนเริ่มแห่ถอนเงิน สถาบันคุ้มครองเงินฝากคุ้มครองแค่ ฿1 ล้านต่อราย'; },
    choices: function (s) {
      return [
        { t: 'ย้ายเงินทันทีไปธนาคารใหญ่ 3 แห่ง', fx: function () { if (R.chance(0.75)) return 'ย้ายเงินทันก่อนธนาคารระงับการถอน'; var frozen = Math.round(s.fin.bal.cash * 0.4); s.flags.frozen = { amt: frozen, until: s.time.w + 10 }; L.post(s.fin, { cash: -frozen, prepaid: frozen }, 'op'); return 'ย้ายได้แค่บางส่วน! ' + F.m(frozen) + ' ถูกระงับชั่วคราว'; } },
        { t: 'ไม่ตื่นตูม รอดูสถานการณ์', fx: function () { if (R.chance(0.4)) { var frozen = Math.round(s.fin.bal.cash * 0.8); s.flags.frozen = { amt: frozen, until: s.time.w + 12 }; L.post(s.fin, { cash: -frozen, prepaid: frozen }, 'op'); return 'ธนาคารระงับการถอนเงิน! ' + F.m(frozen) + ' ถูกแช่แข็ง 12 สัปดาห์'; } return 'ข่าวลือไม่เป็นความจริง ธนาคารผ่านไปได้'; } }
      ];
    }
  });
  E.effect('unfreeze', function () { });

  E.register({
    id: 'investor_intro', cat: 'funding', weight: 1.5, cooldown: 26,
    cond: function (s) { return s.time.w > 6 && !s.funding.raise; },
    init: function (s) { var a = s.funding.investors.filter(function (i) { return i.type === 'angel' && i.passedUntil < s.time.w; }); return a.length ? { inv: R.pick(a).id } : null; },
    title: 'Angel investor อยากคุยด้วย',
    body: function (s, d) { var inv = s.funding.investors.find(function (i) { return i.id === d.inv; }); return 'เพื่อนแนะนำ ' + inv.name + ' (' + inv.bio + ') ให้รู้จัก เขาบอกว่า "ชอบผู้ก่อตั้งแบบคุณ ถ้าจะระดมทุนเมื่อไหร่บอกผมก่อนนะ"'; },
    choices: function (s, d) {
      var inv = s.funding.investors.find(function (i) { return i.id === d.inv; });
      return [
        { t: 'นัดกินกาแฟสร้างความสัมพันธ์', fx: function () { inv.warm = Math.min(1.5, inv.warm + 0.8); return inv.name + ' อยู่ในรายชื่อนักลงทุนที่อบอุ่นแล้ว'; } },
        { t: 'ยังไม่ว่าง', fx: function () { return 'ไว้ค่อยติดต่อ'; } }
      ];
    }
  });

  E.register({
    id: 'bridge_offer', cat: 'funding', weight: 4, cooldown: 26,
    cond: function (s) { return s.kpi.runway < 4 && s.funding.rounds.length > 0 && !s.funding.raise; },
    title: 'นักลงทุนเดิมเสนอเงินกู้แปลงสภาพ (Bridge)',
    body: function (s) { var amt = Math.round(Math.max(3e6, s.kpi.burn * 5) / 1e5) * 1e5; return 'นักลงทุนเดิมเห็นว่าเงินใกล้หมด เสนอ Bridge note ' + F.m(amt) + ' แปลงเป็นหุ้นที่ส่วนลด 25% ในรอบหน้า ภายใต้ cap ' + F.m(s.funding.lastPost * 0.8) + ' (ต่ำกว่ามูลค่ารอบที่แล้ว)\n\nเงื่อนไข: ต้องลด burn อย่างน้อย 20%'; },
    choices: function (s) {
      var amt = Math.round(Math.max(3e6, s.kpi.burn * 5) / 1e5) * 1e5;
      var inv = s.funding.investors.find(function (i) { return s.funding.holders.some(function (h) { return h.id === i.id; }); }) || s.funding.investors[0];
      var okp = s.funding.board.confidence > 25 || s.funding.relations > 55;
      return [
        { t: 'รับ Bridge', d: okp ? '' : 'นักลงทุนลังเล — ความเชื่อมั่นต่ำ', fx: function () { if (!okp && R.chance(0.5)) return 'สุดท้ายนักลงทุนไม่อนุมัติ "เราไม่อยากเอาเงินดีไปไล่ตามเงินเสีย"'; RW.Funding.issueSafe(s, inv, amt, s.funding.lastPost * 0.8, 0.25); s.flags.burnPromise = { w: s.time.w + 13, burn: s.kpi.burn * 0.8 }; return 'ได้รับเงิน ' + F.m(amt) + ' ต่อชีวิตไปได้อีกหลายเดือน'; } },
        { t: 'ปฏิเสธ', fx: function () { return 'คุณจะหาทางอื่น'; } }
      ];
    }
  });

  // =====================================================================
  //  RANDOM EVENTS — MARKET / MACRO SHOCKS (generic)
  // =====================================================================
  E.register({
    id: 'viral_good', cat: 'market', weight: 1.2, cooldown: 30,
    cond: function (s) { return (s.kpi.customers || 0) > 20; },
    title: 'ลูกค้ารีวิวจนเป็นไวรัล',
    body: function (s) { return 'ลูกค้าคนหนึ่งโพสต์เล่าประสบการณ์ดีๆ กับ ' + s.company.name + ' จนมียอดแชร์หลายพัน คนเริ่มถามถึงสินค้าของคุณในคอมเมนต์'; },
    choices: function (s) {
      return [
        { t: 'อัดโฆษณาต่อยอด ฿150,000', fx: function () { L.spend(s.fin, 'mkt', 150000); H.buzz(s, 1.6, 4); H.brand(s, 5); return 'กระแสพุ่งต่อเนื่อง'; } },
        { t: 'ขอบคุณลูกค้าและให้ส่วนลดพิเศษ', fx: function () { H.buzz(s, 1.3, 3); H.brand(s, 4); return 'ลูกค้าประทับใจ'; } }
      ];
    }
  });

  E.register({
    id: 'viral_bad', cat: 'market', weight: function (s) { return 0.6 + (s.biz && s.biz.quality != null ? (60 - s.biz.quality) / 40 : 0.5); }, cooldown: 30, bad: true,
    cond: function (s) { return (s.kpi.customers || 0) > 30; },
    title: 'ดราม่าลูกค้าในโซเชียล',
    body: function (s) { return 'ลูกค้ารายหนึ่งโพสต์ด่า ' + s.company.name + ' อย่างรุนแรง ' + R.pick(['ว่าบริการแย่และไม่มีใครตอบ', 'ว่าถูกเรียกเก็บเงินซ้ำ', 'พร้อมคลิปที่ดูแย่มาก', 'ว่าถูกพนักงานพูดจาไม่ดี']) + ' เพจดังหยิบไปแชร์ต่อ คอมเมนต์ส่วนใหญ่ไม่เข้าข้างคุณ'; },
    choices: function (s) {
      return [
        { t: 'ขอโทษสาธารณะ ชดเชยเต็มที่ แก้ปัญหาจริง', fx: function () { L.spend(s.fin, 'other_exp', 40000); H.brand(s, -2); return 'คนส่วนใหญ่ให้อภัย บางคนชมว่ารับผิดชอบดี'; } },
        { t: 'ชี้แจงข้อเท็จจริงว่าลูกค้าเข้าใจผิด', fx: function () { if (R.chance(0.4)) { H.brand(s, 1); return 'ข้อมูลของคุณชัดเจน กระแสกลับมาเข้าข้างคุณ'; } H.brand(s, -9); H.buzz(s, 0.8, 6); return 'ดราม่าบานปลาย ถูกมองว่าเถียงลูกค้า'; } },
        { t: 'ส่งหนังสือทนายขู่ฟ้องหมิ่นประมาท', fx: function () { H.brand(s, -14); H.buzz(s, 0.7, 8); H.rep(s, -4); return 'Streisand effect — ข่าวแรงกว่าเดิมสิบเท่า'; } },
        { t: 'เงียบ รอให้กระแสหายไป', fx: function () { H.brand(s, -6); H.buzz(s, 0.88, 4); return 'กระแสค่อยๆ จางไป แต่ภาพจำยังอยู่'; } }
      ];
    }
  });

  E.register({
    id: 'pandemic', cat: 'market', weight: 0.12, cooldown: 400, once: true, bad: true,
    cond: function (s) { return s.time.w > 40; },
    title: 'โรคระบาดรอบใหม่ — รัฐประกาศมาตรการคุมเข้ม',
    body: function (s) { return 'เชื้อไวรัสสายพันธุ์ใหม่ระบาดหนัก รัฐบาลประกาศปิดห้างและร้านอาหารห้ามนั่งทาน 8 สัปดาห์ บริษัทต้องให้พนักงานทำงานจากบ้าน\n\n' + (s.industry === 'fnb' ? 'ร้านอาหารคือธุรกิจที่โดนหนักที่สุด รายได้หน้าร้านจะหายไปเกือบหมด' : s.industry === 'ecom' ? 'คนหันมาซื้อของออนไลน์มากขึ้น แต่ซัพพลายเชนสะดุด' : 'ธุรกิจลูกค้าบางส่วนตัดงบ บางส่วนเร่งปรับตัวสู่ดิจิทัล'); },
    choices: function (s) {
      return [
        { t: 'ตั้งรับ: ลดต้นทุนทันที ขอลดค่าเช่า', fx: function () { s.flags.pandemic = s.time.w + 8; H.M(s).onPandemic && H.M(s).onPandemic(s); return 'เข้าสู่โหมดประคองตัว'; } },
        { t: 'รุก: ใช้วิกฤตเป็นโอกาส ปรับโมเดลธุรกิจ', fx: function () { s.flags.pandemic = s.time.w + 8; s.flags.pandemicPivot = 1; H.energy(s, -12); H.M(s).onPandemic && H.M(s).onPandemic(s, true); return 'ทีมทำงานหนักเพื่อปรับตัว'; } }
      ];
    }
  });

  E.register({
    id: 'protest', cat: 'market', weight: 0.4, cooldown: 120, bad: true,
    title: 'ความไม่สงบทางการเมือง',
    body: 'การชุมนุมยืดเยื้อในใจกลางเมือง มีการปิดถนนหลายจุด ความเชื่อมั่นผู้บริโภคและนักลงทุนต่างชาติลดลง',
    choices: function (s) {
      return [{ t: 'ติดตามสถานการณ์อย่างใกล้ชิด', fx: function () { s.world.vc = Math.max(0.35, s.world.vc - 0.08); s.world.macro.consumer *= 0.95; s.world.macro.demand *= 0.97; return 'ตลาดชะลอตัวลงช่วงหนึ่ง'; } }];
    }
  });

  E.register({
    id: 'stimulus', cat: 'market', weight: 0.5, cooldown: 100,
    cond: function (s) { return s.industry !== 'saas'; },
    title: 'รัฐบาลออกมาตรการกระตุ้นการใช้จ่าย',
    body: 'โครงการ "คนละครึ่ง/ช้อปดีมีคืน" รอบใหม่ ประชาชนใช้จ่ายเพิ่มขึ้นชัดเจน ร้านค้าที่ร่วมโครงการได้ประโยชน์',
    choices: function (s) {
      return [
        { t: 'ร่วมโครงการ (ระบบภาษีต้องพร้อม)', fx: function () { if (!s.fin.vat.registered && H.M(s).b2c) { H.buzz(s, 1.06, 8); return 'ร่วมได้บางส่วน — ยังไม่จด VAT จึงได้ประโยชน์จำกัด'; } H.buzz(s, 1.18, 8); return 'ยอดขายเพิ่มขึ้นช่วงมาตรการ'; } },
        { t: 'ไม่ร่วม', fx: function () { return 'ข้ามไป'; } }
      ];
    }
  });
})(globalThis.RW = globalThis.RW || {});
