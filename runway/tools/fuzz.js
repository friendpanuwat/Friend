// Fuzz: random decisions, all industries/difficulties, 10 years. Checks exceptions, NaN, ledger balance.
const { play, RW } = require('./bot.js');
const inds = ['saas', 'ecom', 'fnb'], diffs = ['easy', 'normal', 'hard', 'brutal'];
let games = 0, problems = 0;
const N = +process.argv[2] || 6;
for (const ind of inds) for (const diff of diffs) for (let i = 0; i < N; i++) {
  games++;
  try {
    play(100 + i * 7 + diffs.indexOf(diff), 520, ind, diff, (s) => {
      // random extra actions to exercise code paths
      const R = Math.random;
      if (R() < 0.02) RW.Act.network(s);
      if (R() < 0.01) RW.Act.toggleUpdates(s);
      if (R() < 0.005 && s.fin.bal.cash > 5e6) RW.Act.hireBanker(s);
      if (R() < 0.004) RW.Act.setAuditor(s, R() < 0.5 ? 'big4' : 'local');
      if (R() < 0.004) RW.Act.setInsurance(s, R() < 0.5);
      if (R() < 0.003) RW.Act.claimWHT(s);
      if (R() < 0.003) RW.Act.startIPO(s);
      const k = s.kpi;
      for (const key of ['cash', 'burn', 'revenueMonthly', 'traction', 'founderPct']) {
        if (typeof k[key] === 'number' && isNaN(k[key])) throw new Error('NaN kpi ' + key + ' w' + s.time.w);
      }
      for (const acct in s.fin.bal) if (!isFinite(s.fin.bal[acct])) throw new Error('non-finite balance ' + acct);
      if (s.founder.energy !== s.founder.energy) throw new Error('NaN energy');
      // render model-independent checks
      RW.Engine.advice(s);
      RW.Funding.waterfall(s, 1e8);
    });
  } catch (e) { problems++; console.log(`FAIL ${ind}/${diff}/${i}:`, e.stack.split('\n').slice(0, 4).join(' | ')); }
}
console.log(`games ${games}, problems ${problems}`);
