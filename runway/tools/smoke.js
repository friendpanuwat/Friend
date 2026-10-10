const RW = require('./load')();
const s = RW.Engine.newGame({ seed: 42, industry: 'saas', difficulty: 'normal', founderName: 'ทดสอบ', bg: 'engineer', companyName: 'TestCo', capital: 1000000, concept: 'hr' });
RW.Act.registerCompany(s);
for (let i = 0; i < 60; i++) {
  RW.Engine.tick(s);
  let ev;
  while ((ev = RW.Events.current(s))) { RW.Events.resolve(s, ev.pid, 0); }
  if (s.over) break;
}
const bs = RW.Ledger.balanceSheet(s.fin);
console.log('week', s.time.w, 'cash', Math.round(s.fin.bal.cash), 'BS check', bs.check.toFixed(2));
console.log('kpi', JSON.stringify({ mrr: s.kpi.mrr, cust: s.kpi.customers, burn: s.kpi.burn, runway: s.kpi.runway, tr: s.kpi.traction }));
console.log('feats', JSON.stringify(s.biz.feats), 'launched', s.biz.launched);
console.log(s.inbox.slice(0, 8).map(m => RW.T.label(m.w) + ' | ' + m.title).join('\n'));
