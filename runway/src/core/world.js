/* RUNWAY — the world outside: macro cycle, VC climate, FX, labour market, competitors, news */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F;
  var W = (RW.World = {});

  W.init = function (state, startPhase) {
    var ph = startPhase || 'growth';
    return {
      phase: ph, macro: U.deepCopy(RW.MACRO[ph]), monthsInPhase: 0,
      vc: RW.MACRO[ph].vc, fx: 35.5, wageIndex: 1, wageIndexYoY: RW.MACRO[ph].wage,
      talentSupply: 1, poach: 1, globalCycle: R.range(-0.1, 0.1),
      competitors: [], news: [], shocks: []
    };
  };

  W.news = function (state, text, kind) {
    state.world.news.unshift({ w: state.time.w, text: text, kind: kind || 'info' });
    if (state.world.news.length > 80) state.world.news.pop();
  };

  W.monthly = function (state) {
    var w = state.world;
    // phase transition
    var cur = RW.MACRO[w.phase];
    var r = R.f(), acc = 0, next = w.phase;
    for (var k in cur.next) { acc += cur.next[k]; if (r <= acc) { next = k; break; } }
    w.monthsInPhase++;
    if (next !== w.phase) {
      w.phase = next; w.monthsInPhase = 0;
      var txt = {
        boom: 'เศรษฐกิจร้อนแรง: GDP ขยายตัวเกินคาด การบริโภคและการลงทุนพุ่ง',
        growth: 'เศรษฐกิจกลับสู่การเติบโตปกติ',
        slowdown: 'สัญญาณเศรษฐกิจชะลอตัว: ส่งออกหดตัว ภาคธุรกิจเริ่มรัดเข็มขัด',
        recession: 'เศรษฐกิจเข้าสู่ภาวะถดถอย: บริษัทจำนวนมากตัดงบ เลิกจ้าง และจ่ายหนี้ช้า',
        recovery: 'เศรษฐกิจเริ่มฟื้นตัว แต่ผู้ประกอบการยังระมัดระวัง'
      }[next];
      W.news(state, txt, next === 'recession' || next === 'slowdown' ? 'bad' : 'good');
      RW.Engine.mail(state, 'world', 'ภาวะเศรษฐกิจเปลี่ยน: ' + RW.MACRO[next].n, txt, next === 'recession' ? 'bad' : 'info');
    }
    // smooth macro parameters toward phase targets
    var tgt = RW.MACRO[w.phase];
    ['demand', 'churn', 'payDelay', 'rate', 'consumer'].forEach(function (k) { w.macro[k] = U.approach(w.macro[k], tgt[k], 0.35); });
    w.macro.wage = tgt.wage;
    // global VC cycle (independent-ish of Thai macro)
    w.globalCycle = U.clamp(w.globalCycle + R.normal(0, 0.035) - w.globalCycle * 0.03, -0.35, 0.35);
    w.vc = U.clamp(U.approach(w.vc, tgt.vc + w.globalCycle, 0.15) + R.normal(0, 0.02), 0.35, 1.6);
    // FX random walk
    w.fx = U.clamp(w.fx + R.normal(0, 0.35) + (35.5 - w.fx) * 0.03, 30, 40);
    // labour market
    w.wageIndex *= Math.pow(tgt.wage, 1 / 12);
    w.talentSupply = U.clamp(U.approach(w.talentSupply, w.phase === 'recession' ? 1.4 : w.phase === 'boom' ? 0.75 : 1, 0.2), 0.6, 1.5);
    w.poach = U.clamp(U.approach(w.poach, w.phase === 'boom' ? 1.45 : w.phase === 'recession' ? 0.6 : w.vc > 1.1 ? 1.2 : 1, 0.2), 0.5, 1.6);
    W.competitorsMonthly(state);
  };

  W.vcLabel = function (v) {
    return v >= 1.25 ? 'ร้อนแรง (เงินไหลเข้า)' : v >= 0.95 ? 'ปกติ' : v >= 0.7 ? 'ซบเซา' : 'ฤดูหนาวของ VC';
  };

  // ---------- Competitors ----------
  W.addCompetitor = function (state, tpl) {
    var c = {
      id: R.id('cp'), name: tpl.name, desc: tpl.desc || '', quality: tpl.quality, price: tpl.price, mkt: tpl.mkt,
      cash: tpl.cash, burn: tpl.burn || tpl.cash / 24, stage: tpl.stage || 'seed', aggr: tpl.aggr || 0.5,
      focus: tpl.focus || null, alive: true, born: state.time.w, share: 0, customers: tpl.customers || 0, global: !!tpl.global
    };
    state.world.competitors.push(c);
    return c;
  };

  W.competitorsMonthly = function (state) {
    var w = state.world;
    var M = RW.Models[state.industry];
    w.competitors.forEach(function (c) {
      if (!c.alive) return;
      c.cash -= c.burn;
      // product improvement proportional to spend
      c.quality = U.clamp(c.quality + R.range(0, 1.1) * (c.burn > 2e6 ? 1.4 : 1) * (c.cash > 0 ? 1 : 0.2), 5, 98);
      // fundraising
      if (c.cash < c.burn * 9 && R.chance(0.08 * w.vc * (c.share > 0.1 ? 1.5 : 0.8))) {
        var idx = RW.STAGE_ORDER.indexOf(c.stage);
        var ns = RW.STAGE_ORDER[Math.min(5, idx + 1)];
        var amt = R.range(RW.STAGES[ns].amt[0], RW.STAGES[ns].amt[1]) * 0.6;
        c.cash += amt; c.stage = ns; c.burn *= 1.6; c.mkt = U.clamp(c.mkt + 12, 0, 100);
        W.news(state, c.name + ' ระดมทุน ' + RW.STAGES[ns].n + ' ' + F.m(amt) + ' — ประกาศเร่งขยายตลาดและอัดงบการตลาด', 'comp');
      }
      // price war when aggressive and losing share to the player
      if (c.aggr > 0.6 && state.kpi && state.kpi.marketShare > c.share && R.chance(0.05)) {
        c.price = Math.max(0.55, c.price * 0.85);
        W.news(state, c.name + ' หั่นราคาลง 15% เพื่อแย่งลูกค้า', 'comp');
        if (state.kpi.marketShare > 0.05) RW.Engine.mail(state, 'world', 'สงครามราคา: ' + c.name + ' ลดราคา', 'คู่แข่งลดราคาลง 15% — อัตราการปิดการขายและการรักษาลูกค้าของคุณอาจได้รับผลกระทบ', 'warn');
      }
      // death
      if (c.cash < 0) {
        if (R.chance(0.3)) {
          c.alive = false;
          W.news(state, c.name + ' ประกาศปิดกิจการหลังเงินทุนหมด', 'comp');
          RW.Engine.mail(state, 'world', 'คู่แข่งปิดตัว: ' + c.name, 'ลูกค้าของเขากำลังมองหาผู้ให้บริการรายใหม่ — โอกาสทองของคุณ', 'good');
          if (M.onCompetitorDied) M.onCompetitorDied(state, c);
        } else {
          c.burn *= 0.7; c.mkt *= 0.8; c.cash = c.burn * 2;
        }
      }
    });
    // new entrants — success attracts competition
    var attract = (state.kpi ? state.kpi.marketShare || 0 : 0) * 0.3 + (w.vc - 0.8) * 0.05;
    var alive = w.competitors.filter(function (c) { return c.alive; }).length;
    if (alive < 7 && R.chance(Math.max(0.005, 0.012 + attract))) {
      var tpl = M.newEntrant(state);
      if (tpl) {
        var c = W.addCompetitor(state, tpl);
        W.news(state, 'ผู้เล่นใหม่เข้าตลาด: ' + c.name + ' — ' + c.desc, 'comp');
        RW.Engine.mail(state, 'world', 'คู่แข่งรายใหม่: ' + c.name, c.desc, c.global ? 'warn' : 'info');
      }
    }
  };

  W.aliveCompetitors = function (state) {
    return state.world.competitors.filter(function (c) { return c.alive; });
  };
})(globalThis.RW = globalThis.RW || {});
