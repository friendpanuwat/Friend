// node tools/trace.js <gameIndex> <fromMonth> [weeks]: monthly P&L trace for one bot game
const { play, RW } = require('./bot.js');
const F = RW.F;
const idx = +process.argv[2] || 0, from = +process.argv[3] || 0, weeks = +process.argv[4] || 260;
const { s } = play(idx, weeks, process.env.IND || 'saas', 'normal');
s.hist.monthly.forEach(m => {
  if (m.m < from) return;
  const p = m.p;
  const pl = m.pl;
  console.log(m.label.padEnd(8), 'rev', F.m(p.rev).padStart(7), 'cogs', F.m(p.cogs).padStart(7), 'rnd', F.m(p.rnd).padStart(7), 'sm', F.m(p.sm).padStart(7), 'ga', F.m(p.ga).padStart(7), 'ni', F.m(p.ni).padStart(8),
    'cf op', F.m(m.cf.op).padStart(7), 'inv', F.m(m.cf.inv).padStart(6), 'fin', F.m(m.cf.fin).padStart(6), 'cash', F.m(m.cash).padStart(7), 'hc', m.hc,
    'mkt', F.m(pl.mkt || 0), 'pen', F.m(pl.penalties || 0), 'prof', F.m(pl.prof || 0), 'ar', F.m(m.bal.ar), 'def', F.m(-m.bal.deferred));
});
console.log('over', s.over && s.over.reason, s.over && s.over.text);
