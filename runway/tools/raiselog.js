const { play, RW } = require('./bot.js');
const F = RW.F;
const idx = +process.argv[2] || 0, weeks = +process.argv[3] || 100;
let lastLog = null;
const { s } = play(idx, weeks, 'saas', 'normal', (s) => {
  const r = s.funding.raise;
  if (r && r.log.length && r.log[0] !== lastLog) {
    const newItems = []; for (const l of r.log) { if (l === lastLog) break; newItems.push(l); }
    newItems.reverse().forEach(l => console.log('w' + l.w, l.m, '| tr', (s.kpi.traction||0).toFixed(1), 'int', r.pipeline.map(p => p.interest ? p.interest.toFixed(2) : '-').join(',')));
    lastLog = r.log[0];
  }
  if (s.time.w % 8 === 0) console.log('  w' + s.time.w, 'cash', F.m(s.fin.bal.cash), 'burn', F.m(s.kpi.burn), 'runway', F.months(s.kpi.runway), 'cust', s.kpi.customers, 'tr', (s.kpi.traction||0).toFixed(1), 'focus', JSON.stringify(s.founder.focus), 'E', Math.round(s.founder.energy), 'stress', Math.round(s.founder.stress));
});
console.log(s.over);
