// Fuzz: random decisions, all industries/difficulties, 10 years. Checks exceptions, NaN, ledger balance.
const { play, RW } = require('./bot.js');
const inds = ['saas', 'ecom', 'fnb'], diffs = ['easy', 'normal', 'hard', 'brutal'];
let games = 0, problems = 0;
const N = +process.argv[2] || 6;
for (const ind of inds) for (const diff of diffs) for (let i = 0; i < N; i++) {
  games++;
  process.env.CH = ['none', 'bootstrap', 'crisis', 'sprint'][i % 4];
  try {
    const res = play(100 + i * 7 + diffs.indexOf(diff), 520, ind, diff, (s) => {
      // random extra actions to exercise code paths
      const R = Math.random;
      if (R() < 0.02) RW.Act.network(s);
      if (R() < 0.01) RW.Act.toggleUpdates(s);
      if (R() < 0.005 && s.fin.bal.cash > 5e6) RW.Act.hireBanker(s);
      if (R() < 0.004) RW.Act.setAuditor(s, R() < 0.5 ? 'big4' : 'local');
      if (R() < 0.004) RW.Act.setInsurance(s, R() < 0.5);
      if (R() < 0.003) RW.Act.claimWHT(s);
      if (R() < 0.003) RW.Act.startIPO(s);
      if (R() < 0.01) {
        const M = RW.Models[s.industry], keys = Object.keys(M.RESEARCH), k = keys[Math.floor(R() * keys.length)];
        const arg = s.industry === 'saas' ? M.SEGS[Math.floor(R() * 4)] : k === 'adtest' ? (s.biz.skus[0] || {}).id : k === 'count' ? (s.biz.sites && s.biz.sites.list[0] || {}).id : null;
        RW.Act.research(s, k, arg);
      }
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
    const s = res.s;
    if (!s.over) RW.Engine.timeUp(s);
    if (!s.over.epilogue || s.over.epilogue.some(p => !p.t || /undefined|NaN/.test(p.t))) throw new Error('bad epilogue ' + JSON.stringify(s.over.epilogue));
    if (s.challenge === 'sprint' && s.time.w > 261 && s.over.reason === 'timeup' && s.over.w > 261) throw new Error('sprint overran');
    if (s.challenge === 'bootstrap' && s.stats.raised > 0) throw new Error('bootstrap raised money');
  } catch (e) { problems++; console.log(`FAIL ${ind}/${diff}/${i}:`, e.stack.split('\n').slice(0, 4).join(' | ')); }
}
console.log(`games ${games}, problems ${problems}`);
