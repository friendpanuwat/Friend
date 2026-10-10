const RW = require('./load')();
const s = RW.Engine.newGame({ seed: 42, industry: 'saas', difficulty: 'normal', founderName: 'ทดสอบ', bg: 'engineer', companyName: 'TestCo', capital: 1000000, concept: 'hr' });
RW.Act.registerCompany(s);
const M = RW.Models.saas;
for (let i = 0; i < 40; i++) {
  RW.Engine.tick(s);
  let ev; while ((ev = RW.Events.current(s))) RW.Events.resolve(s, ev.pid, 0);
  if (i % 4 === 0 || s.biz.launched) {
    const b = s.biz;
    console.log(s.time.w, 'launched', b.launched, 'core', b.feats.core, 'prog', b.roadmap[0] && b.roadmap[0].prog.toFixed(1), 'caps', JSON.stringify(Object.fromEntries(Object.entries(s.caps).map(([k,v])=>[k,+v.toFixed(2)]))),
      'leads', M.SEGS.map(k=>b.segs[k].stat.leads.toFixed(2)).join('/'), 'V', M.SEGS.map(k=>M.value(s,k).toFixed(2)).join('/'), 'pf', M.SEGS.map(k=>M.priceFactor(s,k).toFixed(2)).join('/'), 'cf', M.SEGS.map(k=>M.compFactor(s,k).toFixed(2)).join('/'), 'cust', M.totalCustomers(b), 'trials', b.segs.micro.trials.length);
  }
}
