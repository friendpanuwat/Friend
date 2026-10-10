const { play, RW } = require('./bot.js');
const F = RW.F;
const ind = process.argv[2] || 'saas', runs = +process.argv[3] || 16, weeks = +process.argv[4] || 260, diff = process.argv[5] || 'normal';
const rows = [];
for (let i = 0; i < runs; i++) {
  const { s } = play(i, weeks, ind, diff);
  const k = s.kpi, M = RW.Models[ind];
  const v = M.valuation(s) * RW.Funding.climate(s);
  const wf = RW.Funding.waterfall(s, v);
  rows.push({ i, over: s.over ? s.over.reason + '@' + s.over.w : 'alive', rev: k.revenueMonthly, val: v, own: k.founderPct, founderVal: wf.founder, stage: s.funding.stage, hc: RW.Team.headcount(s), ebitda: k.ebitdaMargin });
}
rows.forEach(r => console.log(`#${r.i} ${r.over.padEnd(14)} rev/m ${F.m(r.rev).padStart(7)} val ${F.m(r.val).padStart(7)} own ${F.pct(r.own, 0).padStart(4)} founder ${F.m(r.founderVal).padStart(7)} ${r.stage.padEnd(9)} hc ${r.hc} ebitda ${F.pct(r.ebitda, 0)}`));
const alive = rows.filter(r => r.over === 'alive');
console.log(`${ind}/${diff}: alive ${alive.length}/${runs}; median founder value of survivors ${F.m(alive.map(r => r.founderVal).sort((a, b) => a - b)[Math.floor(alive.length / 2)] || 0)}; best ${F.m(Math.max(0, ...alive.map(r => r.founderVal)))}`);
