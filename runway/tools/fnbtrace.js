const {play,RW}=require('./bot.js');
const F=RW.F;
const idx=+process.argv[2]||0, weeks=+process.argv[3]||60, every=+process.argv[4]||4;
const {s}=play(idx,weeks,'fnb','normal',(s)=>{ if(s.time.w%every===0){const b=s.biz,M=RW.Models.fnb; b.branches.forEach(br=>{ const l=br.last; console.log('w'+s.time.w, br.n, br.type, br.state, 'foot',Math.round(br.foot),'seats',br.seats,'rent',br.rent,'fit',br.fit,'staff',br.staff,'util',(br.util||0).toFixed(2),'rt',(br.rating||0).toFixed(2), l? 'rev '+F.m(l.rev)+' food '+F.m(l.food)+' labor '+F.m(l.labor)+' rent '+F.m(l.rent)+' util '+F.m(l.util)+' gp '+F.m(l.gp)+' wall '+F.m(l.wall)+' cov '+l.covers+' del '+l.deliv:''); });
 const m=s.hist.monthly[s.hist.monthly.length-1]; console.log('  cash',F.m(s.fin.bal.cash),'loans',F.m(-s.fin.bal.loans), m? 'co rev '+F.m(m.p.rev)+' ni '+F.m(m.p.ni)+' opex '+F.m(m.p.opex)+' ga '+F.m(m.p.ga)+' sm '+F.m(m.p.sm)+' rnd '+F.m(m.p.rnd):'' , 'hc', RW.Team.headcount(s), 'focus', JSON.stringify(s.founder.focus)); }});
console.log(s.over && s.over.reason, s.over && s.over.w);
