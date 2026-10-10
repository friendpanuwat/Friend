// Heuristic "competent founder" bot for balance testing. Usage: node tools/bot.js [runs] [weeks] [industry] [difficulty]
const RW = require('./load')(process.env.EXTRA ? process.env.EXTRA.split(',') : []);
const U = RW.U, F = RW.F, A = RW.Act;

const runs = +(process.argv[2] || 12), weeks = +(process.argv[3] || 260), industry = process.argv[4] || 'saas', diff = process.argv[5] || 'normal';
const verbose = process.env.V === '1';

function policySaaS(s) {
  const M = RW.Models.saas, b = s.biz, w = s.time.w, k = s.kpi;
  if (w === 1) {
    A.registerCompany(s); A.assignIP(s);
    A.setHours(s, 60);
    s.founder.focus = { build: 50, sell: 20, market: 0, discover: 25, team: 0, fundraise: 0, admin: 5, consult: 0 };
    M.act.addRoadmap(s, 'ux');
    b.discTarget = 'micro';
  }
  // roadmap: keep queue topped up with what segments need most (using discovered needs if known)
  if (b.roadmap.length < 3) {
    const segs = M.SEGS.filter(x => b.segs[x].on);
    let best = null, bestScore = 0;
    M.FKEYS.forEach(f => {
      if (b.feats[f] >= M.FEAT[f].costs.length || b.roadmap.some(r => r.f === f)) return;
      let sc = 0;
      segs.forEach(sg => { const n = b.segs[sg].need[f]; if (n && b.feats[f] < n.lvl) sc += n.w * (b.segs[sg].disc / 100 + 0.2); });
      sc /= M.FEAT[f].costs[b.feats[f]];
      if (sc > bestScore) { bestScore = sc; best = f; }
    });
    if (best) M.act.addRoadmap(s, best); else if (b.feats.core < 6 && !b.roadmap.some(r => r.f === 'core')) M.act.addRoadmap(s, 'core');
  }
  if (b.launched) {
    // price near willingness to pay
    M.SEGS.forEach(sg => { const wtp = M.wtp(s, sg); if (b.segs[sg].on) b.segs[sg].price = Math.round(Math.max(wtp * 0.95, M.CONCEPTS[b.concept].price[sg] * 0.5)); });
    if (w - b.launchW === 2) { const fr0 = s.funding.raise ? 25 : 0; s.founder.focus = { build: 35, sell: 35 - fr0, market: 5, discover: 20, team: 0, fundraise: fr0, admin: 5, consult: 0 }; }
    // marketing budget ~ % of cash
    const cash = s.fin.bal.cash;
    const budget = Math.max(0, Math.min(cash / 60, 400000));
    const ltvOK = k.ltvCac == null || k.ltvCac > 1.5;
    b.ch.search.budget = Math.round(budget * (ltvOK ? 0.5 : 0.2) / 1000) * 1000;
    b.ch.content.budget = Math.round(budget * 0.25 / 1000) * 1000;
    b.ch.social.budget = Math.round(budget * (ltvOK ? 0.25 : 0.1) / 1000) * 1000;
    if (k.customers > 30 && !b.segs.mid.on && b.feats.core >= 3) { b.segs.mid.on = true; b.segs.mid.motion = 'inside'; }
    if (k.customers > 100 && !b.segs.ent.on && b.feats.ent >= 2 && b.feats.security >= 2) b.segs.ent.on = true;
    if (b.segs.mid.on) b.ch.events.budget = Math.round(budget * 0.15 / 1000) * 1000;
    if (k.customers > 40 && !b.ch.partners.on) b.ch.partners.on = true;
    if (k.customers > 20) b.ch.referral.incentive = 1000;
  }
  // fundraising
  const fr = s.funding.raise;
  const stage = RW.Funding.stageOfRaise(s);
  const ready = (k.traction || 0) / RW.Funding.BAR[stage];
  if (!fr && s.company.registered && (k.runway < 9 || ready > 1.0) && w > 8 && !(s.flags.failedRaiseW && w - s.flags.failedRaiseW < 20)) {
    const fair = RW.Funding.fairPre(s, stage);
    const inst = stage === 'preseed' || (stage === 'seed' && ready < 1.1) ? 'safe' : 'priced';
    const target = Math.max(RW.STAGES[stage].amt[0] * 0.5, Math.min(RW.STAGES[stage].amt[1], (k.burn > 0 ? k.burn : 300000) * 20, fair * (inst === 'safe' ? 0.18 : 0.25)));
    A.startRaise(s, { stage, instrument: inst, target: Math.round(target / 1e5) * 1e5, ask: Math.round(fair * 0.95 / 1e5) * 1e5, minClose: target * 0.6 });
    RW.Funding.eligibleInvestors(s, stage).sort((a, b) => b.warm - a.warm).slice(0, 12).forEach(i => A.pitch(s, i.id));
    if (verbose) console.log('  w' + w + ' start raise ' + stage + ' ' + inst + ' target ' + F.m(target) + ' ask ' + F.m(fair * 0.95) + ' tr ' + (k.traction || 0).toFixed(1));
  }
  if (fr) {
    if (fr.instrument === 'safe' && RW.Funding.activePitches(s) < 3) RW.Funding.eligibleInvestors(s, fr.stage).filter(i => !fr.pipeline.some(p => p.invId === i.id)).slice(0, 4).forEach(i => A.pitch(s, i.id));
    if (fr.leadId && fr.status === 'active') {
      if (RW.Funding.committed(s) >= fr.minClose || w - fr.startW > 20) A.closeRound(s);
      else RW.Funding.eligibleInvestors(s, fr.stage).filter(i => !fr.pipeline.some(p => p.invId === i.id)).slice(0, 3).forEach(i => A.pitch(s, i.id));
    }
    if (fr.instrument === 'safe') {
      const raised = s.funding.safes.filter(x => x.w >= fr.startW).reduce((a, x) => a + x.amount, 0);
      if (raised >= fr.target) A.endSafeRound(s);
      if (w - fr.startW > 24) A.endSafeRound(s);
    }
  } else if (s.founder.focus.fundraise > 0) RW.Founder.setFocus(s, 'fundraise', 0);
  // wellbeing
  if (s.founder.energy < 30 && s.founder.vacation === 0 && k.runway > 2) A.vacation(s, 1);
  if (s.founder.stress > 75) A.setHours(s, 55); else if (s.founder.energy > 70) A.setHours(s, 60);
  // consulting to extend runway when no funding in sight
  const tech = RW.Team.capOf(s, 'dev') - RW.Team.capOf(s, 'f_build');
  if (k.runway < 6 && !s.funding.raise && s.funding.stage !== 'A' && (s.founder.focus.consult || 0) === 0) RW.Founder.setFocus(s, 'consult', 30);
  if ((k.runway > 10 || s.funding.raise) && s.founder.focus.consult > 0) RW.Founder.setFocus(s, 'consult', 0);
  // founder salary once funded
  if (s.funding.stage !== 'bootstrap' && s.founder.salary === 0 && s.fin.bal.cash > 3e6) A.setFounderSalary(s, Math.max(45000, s.founder.burn * 1.1));
  if (s.founder.cash < s.founder.burn * 2 && s.founder.salary < s.founder.burn) A.setFounderSalary(s, s.founder.burn * 1.1);
  // hiring
  if (s.company.registered && w % 2 === 0) {
    const cash = s.fin.bal.cash, burn = Math.max(1, k.burn || 1);
    const canAfford = (extra) => (cash / Math.max(1, burn + extra)) > (s.founder.skills.tech < 40 && count0('eng') === 0 ? 7 : 14);
    const count0 = r => RW.Team.all(s).filter(e => e.role === r).length + s.team.openings.filter(o => o.role === r).length;
    const active = RW.Team.all(s), count = r => active.filter(e => e.role === r).length + s.team.openings.filter(o => o.role === r).length;
    const want = [];
    if (count('eng') < 2 + Math.floor(k.customers / 120)) want.push(['eng', 2]);
    if (b.launched && b.support.overload > 0.1 && count('support') < 1 + k.customers / 250) want.push(['support', 1]);
    if (b.launched && count('marketer') < 1 && k.customers > 10) want.push(['marketer', 2]);
    if (b.launched && count('design') < 1 && count('eng') >= 2) want.push(['design', 2]);
    if (b.segs.mid.on && count('ae') < 1 + Math.floor(k.customers / 200)) want.push(['ae', 2]);
    if (b.segs.mid.on && count('csm') < Math.floor((M.customers(b, 'mid') + b.accounts.length * 3) / 30)) want.push(['csm', 2]);
    if (count('eng') >= 4 && !active.some(e => e.role === 'eng' && e.level >= 4) && count('eng') < 30) want.push(['eng', 4]);
    if (active.length > 8 && count('hr') < 1) want.push(['hr', 2]);
    if (active.length > 10 && count('finance') < 1) want.push(['finance', 3]);
    if (active.length > 6 && count('pm') < 1) want.push(['pm', 3]);
    want.slice(0, 2).forEach(([role, lvl]) => {
      const sal = RW.ROLES[role].salary[lvl];
      if (canAfford(sal * 1.3) && s.team.openings.length < 4) A.openPosition(s, role, lvl, 'linkedin');
    });
  }
  // offers to best candidates
  s.team.candidates.slice().sort((a, b) => b.est - a.est).forEach(c => {
    if (c.est < 45) { A.rejectCandidate(s, c.id); return; }
    const r = A.offer(s, c.id, c.ask, 0);
    if (!r.ok && r.counter) A.offer(s, c.id, c.ask, 0);
  });
  // cost control when runway low
  if (k.runway < 4 && !s.funding.raise) {
    Object.keys(b.ch).forEach(ch => { if (b.ch[ch].budget) b.ch[ch].budget = Math.round(b.ch[ch].budget * 0.5); });
  }
  if (k.runway < 2.5 && RW.Team.active(s).length > 3) {
    const victims = RW.Team.active(s).sort((a, b) => a.lastOut - b.lastOut).slice(0, Math.ceil(RW.Team.active(s).length * 0.25));
    A.layoff(s, victims.map(e => e.id));
  }
  // office
  const hc = RW.Team.headcount(s) + 1;
  if (hc > RW.Team.officeCapacity(s) - 1) {
    if (hc < 20) A.moveOffice(s, 'cowork', hc + 6);
    else { A.setPolicy(s, 'workmode', 1); if (hc + 1 > RW.Team.officeCapacity(s)) A.moveOffice(s, 'small', Math.round(hc * 1.6)); }
  }
  // annual policy
  if (s.team.policy.benefits < 2 && hc > 10) s.team.policy.benefits = 2;
}


function policyEcom(s) {
  const M = RW.Models.ecom, b = s.biz, w = s.time.w, k = s.kpi, c = M.CONCEPTS[b.concept];
  if (w === 1) {
    A.registerCompany(s); A.assignIP(s); A.setHours(s, 60);
    s.founder.focus = { build: 40, sell: 20, market: 20, discover: 15, team: 0, fundraise: 0, admin: 5, consult: 0 };
  }
  const active = b.skus.filter(x => x.active);
  active.forEach(sku => {
    const st = M.stock(sku), inc = M.incoming(b, sku.id);
    if (st + inc === 0) M.placePO(s, sku.id, c.sup.local.moq, 'local');
    if (!sku.auto && sku.avg > 3) { sku.auto = true; sku.cover = 5; sku.autoSup = 'local'; }
    // pricing: keep near reference
  });
  const rev = k.revenueMonthly || 0;
  if (active.length) {
    const roasOK = k.roas == null || k.roas > 2.2;
    const budget = Math.max(0, Math.min(s.fin.bal.cash / 45, 300000));
    b.ch.market.ads = Math.round(budget * (roasOK ? 0.6 : 0.25) / 1000) * 1000;
    if (b.ch.social.open) b.ch.social.ads = Math.round(budget * (roasOK ? 0.3 : 0.1) / 1000) * 1000;
    if (b.ch.web.open) b.ch.web.ads = Math.round(budget * (roasOK ? 0.2 : 0.05) / 1000) * 1000;
    if (w > 16 && !b.ch.social.open) M.act.openChannel(s, 'social');
    if (rev > 250000 && !b.ch.web.open) M.act.openChannel(s, 'web');
    if (rev > 200000 && !b.crm) M.act.toggleCRM(s);
    if (!b.ch.retail.open && rev > 800000) M.act.openChannel(s, 'retail');
    if (b.ch.retail.open) active.filter(x => !x.retail).slice(0, 1).forEach(x => { if (s.fin.bal.cash > 3e6) M.act.listRetail(s, x.id); });
    if (b.fulfil.backlog > 40 && RW.Team.capOf(s, 'fulfil') < 1) M.act.setFulfil(s, '3pl');
  }
  if (b.dev.length === 0 && active.length < Math.min(7, 1 + Math.floor(rev / 500000)) && s.fin.bal.cash > 800000 && w > 10) {
    const t = c.types[(active.length + 1) % c.types.length];
    M.act.develop(s, t[0], active.length > 3 ? 'premium' : 'mass');
  }
  return { hireWants: (count) => {
    const want = [];
    if (b.fulfil.mode === 'self' && b.fulfil.backlog > 10 && count('warehouse') < 1 + rev / 1.5e6) want.push(['warehouse', 1]);
    if (b.chat.backlog > 80 && count('cs') < 1 + rev / 2e6) want.push(['cs', 1]);
    if (rev > 300000 && count('content') < 1 + rev / 3e6) want.push(['content', 2]);
    if (rev > 500000 && count('marketer') < 1) want.push(['marketer', 2]);
    if (rev > 800000 && count('rnd') < 1) want.push(['rnd', 2]);
    if (rev > 800000 && count('buyer') < 1) want.push(['buyer', 2]);
    if (b.ch.social.open && rev > 600000 && count('live') < 1) want.push(['live', 2]);
    if (b.ch.retail.open && count('ae') < 1) want.push(['ae', 2]);
    return want;
  } };
}


function policyGeneric(s, spec) {
  const w = s.time.w, k = s.kpi;
  const fr = s.funding.raise;
  const stage = RW.Funding.stageOfRaise(s);
  const ready = (k.traction || 0) / RW.Funding.BAR[stage];
  if (!fr && s.company.registered && (k.runway < 9 || ready > 1.0) && w > 8 && !(s.flags.failedRaiseW && w - s.flags.failedRaiseW < 20)) {
    const fair = RW.Funding.fairPre(s, stage);
    const inst = stage === 'preseed' || (stage === 'seed' && ready < 1.1) ? 'safe' : 'priced';
    const target = Math.max(RW.STAGES[stage].amt[0] * 0.5, Math.min(RW.STAGES[stage].amt[1], (k.burn > 0 ? k.burn : 300000) * 20, fair * (inst === 'safe' ? 0.18 : 0.25)));
    A.startRaise(s, { stage, instrument: inst, target: Math.round(target / 1e5) * 1e5, ask: Math.round(fair * 0.95 / 1e5) * 1e5, minClose: target * 0.6 });
    RW.Funding.eligibleInvestors(s, stage).sort((a, b) => b.warm - a.warm).slice(0, 12).forEach(i => A.pitch(s, i.id));
  }
  if (fr) {
    if (s.founder.focus.fundraise < 20) RW.Founder.setFocus(s, 'fundraise', 25);
    if (fr.instrument === 'safe' && RW.Funding.activePitches(s) < 3) RW.Funding.eligibleInvestors(s, fr.stage).filter(i => !fr.pipeline.some(p => p.invId === i.id)).slice(0, 4).forEach(i => A.pitch(s, i.id));
    if (fr.leadId && fr.status === 'active') {
      if (RW.Funding.committed(s) >= fr.minClose || w - fr.startW > 20) A.closeRound(s);
      else RW.Funding.eligibleInvestors(s, fr.stage).filter(i => !fr.pipeline.some(p => p.invId === i.id)).slice(0, 3).forEach(i => A.pitch(s, i.id));
    }
    if (fr.instrument === 'safe') {
      if ((fr.raised || 0) >= fr.target || w - fr.startW > 24) A.endSafeRound(s);
    }
  } else if (s.founder.focus.fundraise > 0) RW.Founder.setFocus(s, 'fundraise', 0);
  if (s.founder.energy < 30 && s.founder.vacation === 0 && k.runway > 2) A.vacation(s, 1);
  if (s.founder.stress > 75) A.setHours(s, 55); else if (s.founder.energy > 70) A.setHours(s, 60);
  if (k.runway < 6 && !s.funding.raise && (s.founder.focus.consult || 0) === 0) RW.Founder.setFocus(s, 'consult', 30);
  if ((k.runway > 10 || s.funding.raise) && s.founder.focus.consult > 0) RW.Founder.setFocus(s, 'consult', 0);
  if (s.funding.stage !== 'bootstrap' && s.founder.salary === 0 && s.fin.bal.cash > 3e6) A.setFounderSalary(s, Math.max(45000, s.founder.burn * 1.1));
  if (s.founder.cash < s.founder.burn * 2 && s.founder.salary < s.founder.burn) A.setFounderSalary(s, s.founder.burn * 1.1);
  if (s.company.registered && w % 2 === 0) {
    const cash = s.fin.bal.cash, burn = Math.max(1, k.burn || 1);
    const count = r => RW.Team.all(s).filter(e => e.role === r).length + s.team.openings.filter(o => o.role === r).length;
    const want = spec.hireWants(count);
    const act = RW.Team.all(s);
    if (act.length > 8 && count('hr') < 1) want.push(['hr', 2]);
    if (act.length > 10 && count('finance') < 1) want.push(['finance', 3]);
    want.slice(0, 2).forEach(([role, lvl]) => {
      const sal = RW.ROLES[role].salary[lvl];
      if (cash / Math.max(1, burn + sal * 1.3) > 10 && s.team.openings.length < 4) A.openPosition(s, role, lvl, 'board');
    });
  }
  s.team.candidates.slice().sort((a, b) => b.est - a.est).forEach(c => {
    if (c.est < 40) { A.rejectCandidate(s, c.id); return; }
    const r = A.offer(s, c.id, c.ask, 0);
    if (!r.ok && r.counter) A.offer(s, c.id, c.ask, 0);
  });
  if (k.runway < 2.5 && RW.Team.active(s).length > 3) {
    const victims = RW.Team.active(s).sort((a, b) => a.lastOut - b.lastOut).slice(0, Math.ceil(RW.Team.active(s).length * 0.25));
    A.layoff(s, victims.map(e => e.id));
  }
  const hc = RW.Team.headcount(s) + 1;
  if (hc > RW.Team.officeCapacity(s) - 1) {
    if (hc < 20) A.moveOffice(s, 'cowork', hc + 6);
    else { A.setPolicy(s, 'workmode', 1); if (hc + 1 > RW.Team.officeCapacity(s)) A.moveOffice(s, 'small', Math.round(hc * 1.6)); }
  }
}

function policyFnb(s) {
  const M = RW.Models.fnb, b = s.biz, w = s.time.w, k = s.kpi, c = M.CONCEPTS[b.concept];
  if (w === 1) {
    A.registerCompany(s); A.assignIP(s); A.setHours(s, 60);
    s.founder.focus = { build: 60, sell: 5, market: 15, discover: 10, team: 5, fundraise: 0, admin: 5, consult: 0 };
  }
  const open = M.openBranches(b), live = M.liveBranches(b);
  // first shop: cheapest decent site
  if (w >= 3 && live.length === 0 && s.company.registered && w % 3 === 0) {
    if (!b.sites || !b.sites.list.length || w - b.sites.w > 8) M.act.scout(s, s.fin.bal.cash > 3e6 ? 'community' : 'street');
    const cost = (x, fin) => x.rent * 3 + x.fit * (fin ? 0.5 : 1) + 120000 + c.staff * 15000 + (x.rent + (c.staff + 2) * 13500) * 2.5 + 100000;
    const ok = b.sites.list.filter(x => cost(x, true) < s.fin.bal.cash).sort((x, y) => (y.quoted / y.rent) - (x.quoted / x.rent));
    const best = ok[0];
    if (best) { if (cost(best, false) < s.fin.bal.cash) M.openBranch(s, best.id, false); else M.openBranch(s, best.id, true); }
    else if (w > 12 && b.sites.type !== 'cloud' && b.concept !== 'bbq') M.act.scout(s, 'cloud');
  }
  // expand when shops are profitable and cash allows
  const walls = open.filter(x => x.last);
  const avgWall = walls.length ? walls.reduce((a, x) => a + x.last.wall / Math.max(1, x.last.rev), 0) / walls.length : -1;
  if (open.length && avgWall > 0.08 && live.length === open.length && s.fin.bal.cash > 3.5e6 && w % 8 === 0) {
    M.act.scout(s, s.fin.bal.cash > 12e6 ? 'mall' : 'community');
    const best = b.sites.list.slice().sort((x, y) => (y.quoted / y.rent) - (x.quoted / x.rent))[0];
    if (best && s.fin.bal.cash > best.fit * 1.6 + best.rent * 8) M.openBranch(s, best.id, s.fin.bal.cash < best.fit * 2.5);
  }
  // close persistent losers
  open.forEach(br => { if (br.hist && br.hist.length >= 6 && br.hist.slice(-6).every(v => v < 0) && open.length > 1) M.closeBranch(s, br.id); });
  if (open.length >= 4 && !b.ck && s.fin.bal.cash > 12e6) M.act.buildCK(s);
  if (open.length >= 5 && !b.fr.on && avgWall > 0.12 && s.fin.bal.cash > 4e6) M.act.startFranchise(s);
  if (w % 26 === 13 && !b.menuProj && s.fin.bal.cash > 1e6) M.act.menuRD(s);
  // assign managers
  const mgrs = RW.Team.all(s).filter(e => e.role === 'branchmgr' && e.startW <= w);
  open.forEach(br => { if (!br.mgr) { const free = mgrs.find(e => !b.branches.some(x => x.mgr === e.id)); if (free) br.mgr = free.id; } });
  if (open.length > 1 && s.founder.focus.build > 40) s.founder.focus = { build: 35, sell: 10, market: 20, discover: 10, team: 15, fundraise: s.founder.focus.fundraise, admin: 10 - 0, consult: 0 };
  return { hireWants: (count) => {
    const want = [];
    const needMgr = live.length - (open.length <= 1 ? 1 : 0);
    if (count('branchmgr') < needMgr) want.push(['branchmgr', 2]);
    if (open.length >= 2 && count('chef') < 1) want.push(['chef', 2]);
    if (open.length >= 3 && count('marketer') < 1) want.push(['marketer', 2]);
    if (open.length >= 3 && count('ops') < 1) want.push(['ops', 3]);
    if (open.length >= 6 && count('branchmgr') < live.length + 1) want.push(['branchmgr', 5]);
    return want;
  } };
}

function resolveEvents(s) {
  let ev, guard = 0;
  while ((ev = RW.Events.current(s)) && guard++ < 20) {
    const r = RW.Events.render(s, ev);
    let idx = 0;
    if (ev.id === 'term_sheet') idx = 0;
    else if (ev.id === 'acq_offer') {
      const o = s.funding.offers.find(x => x.id === ev.data.offer);
      idx = o && o.price > 5e9 ? 0 : 2;
    } else if (ev.id === 'old_boss') idx = 0;
    else if (ev.id === 'ceo_replace') idx = r.choices.length > 1 ? 1 : 0;
    else if (ev.id === 'year_end_bonus') idx = s.kpi.runway > 12 ? 2 : 1;
    else if (ev.id === 'annual_review') idx = s.kpi.runway > 12 ? 2 : 1;
    else if (ev.id === 'fudge_numbers') idx = 1;
    else if (ev.id === 'data_breach') idx = 0;
    else if (ev.id === 'tea_money') idx = 1;
    else idx = Math.floor(RW.R.f() * r.choices.length);
    const res = RW.Events.resolve(s, ev.pid, idx);
    if (verbose && res) console.log('  w' + s.time.w + ' [' + r.title + '] → ' + r.choices[idx].t + ' :: ' + res);
  }
}

function play(i, weeks, industry, diff, hook) {
  const bg = ['engineer', 'sales', 'consultant', 'serial'][i % 4];
  const CONC = { saas: ['hr', 'acct', 'pos', 'ai'], ecom: ['skincare', 'coffee', 'apparel', 'supplement'], fnb: ['cafe', 'thai', 'bbq', 'bakery'] }[industry];
  const concept = CONC[Math.floor(i / 4) % 4];
  const s = RW.Engine.newGame({ seed: 1000 + i, industry, difficulty: diff, founderName: 'บอท', bg, companyName: 'Bot' + i, capital: Math.min(industry === 'fnb' ? 2500000 : 1500000, RW.BACKGROUNDS[bg].savings * (industry === 'fnb' ? 0.85 : 0.7)), concept, product: concept, challenge: process.env.CH });
  const yearly = [];
  for (let w = 0; w < weeks && !s.over; w++) {
    RW.R.bind(s.rng);
    if (industry === 'saas') policySaaS(s);
    else if (industry === 'ecom') policyGeneric(s, policyEcom(s));
    else if (industry === 'fnb') policyGeneric(s, policyFnb(s));
    else if (global.POLICY) global.POLICY(s);
    RW.Engine.tick(s);
    resolveEvents(s);
    const bs = RW.Ledger.balanceSheet(s.fin);
    if (Math.abs(bs.check) > 1) { console.log('LEDGER IMBALANCE', bs.check, 'w', s.time.w); process.exit(1); }
    if (hook) hook(s);
    if (s.time.w % 52 === 0) {
      const k = s.kpi;
      yearly.push(`Y${s.time.w / 52}: cash ${F.m(k.cash)} burn ${F.m(k.burn)} rev/m ${F.m(k.revenueMonthly)} ARR ${F.m(k.arr || 0)} cust ${k.customers} hc ${k.headcount} stage ${s.funding.stage} tr ${(k.traction || 0).toFixed(0)} own ${F.pct(k.founderPct, 0)} val ${F.m(s.funding.lastPost)} E${Math.round(s.founder.energy)}`);
    }
  }
  return { s, bg, concept, yearly };
}
module.exports = { play, policySaaS, resolveEvents, RW };

if (require.main === module) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const { s, bg, concept, yearly } = play(i, weeks, industry, diff);
    const k = s.kpi;
    results.push({ i, bg, concept, over: s.over ? s.over.reason : 'alive', w: s.time.w, arr: k.arr, wealth: s.over ? s.over.wealth : null });
    console.log(`#${i} ${bg}/${concept}: ${s.over ? s.over.reason + ' @w' + s.over.w : 'alive'} rounds[${s.funding.rounds.map(r => r.stage + ':' + F.m(r.amount) + '@' + F.m(r.pre)).join(' ')}] safes ${s.funding.safes.length} raised ${F.m(s.stats.raised)} own ${F.pct(k.founderPct, 0)}`);
    yearly.forEach(y => console.log('   ' + y));
    if (verbose) console.log(s.inbox.filter(m => m.tone === 'bad').slice(0, 10).map(m => '   ! ' + RW.T.label(m.w) + ' ' + m.title).join('\n'));
  }
  const alive = results.filter(r => r.over === 'alive').length;
  console.log(`\nalive ${alive}/${runs}; outcomes:`, results.reduce((a, r) => (a[r.over] = (a[r.over] || 0) + 1, a), {}));
}
