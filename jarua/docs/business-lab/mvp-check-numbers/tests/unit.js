const fs = require('fs'), vm = require('vm');
const ctx = { console, Math, Date, JSON, Object, Array, String, Number, isFinite, parseFloat };
vm.createContext(ctx);
for (const f of ['../.out/calc.js', '../src/data.js', '../src/engine.js']) vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx);
const R = (code) => vm.runInContext(code, ctx);
const models = R('MODEL_ORDER');
let fails = 0;
function chk(cond, msg) { if (!cond) { fails++; console.log('  FAIL', msg); } }
for (const m of models) {
  const inp = R(`JSON.parse(JSON.stringify(MODELS['${m}'].sample))`);
  if (R(`MODELS['${m}'].defPer`) && !inp.volumePer) inp.volumePer = R(`MODELS['${m}'].defPer`);
  ctx.__inp = inp; ctx.__m = m;
  const S = R('compute(__inp, __m)');
  const F = R('detect(compute(__inp, __m), __inp, __m)');
  const sens = R('sensitivity(compute(__inp, __m), __inp, __m)');
  console.log(m.padEnd(12), 'profit', Math.round(S.profit), 'rev', Math.round(S.revenue), 'BE', S.be && (S.be.impossible ? 'impossible' : S.be.vol.toFixed(1) + ' safety ' + (S.be.safety * 100).toFixed(1) + '%'),
    'cashEnd', Math.round(S.cashEnd), 'lowest', Math.round(S.lowest), '| findings:', F.map(f => f.id + '(' + f.lv + ',' + Math.round(f.money) + ',q' + f.qs.length + ')').join(' '));
  console.log('             sens:', sens.map(s => s.label + ' +' + Math.round(s.gain)).join(' · '));
  // consistency: profit equals v4
  const r = R('JaruaCalc.calculateV4(v4Input(__inp, __m))');
  chk(Math.abs(r.netProfitMonthly - S.profit) < 0.01, m + ' profit mismatch');
  // split sums to revenue
  const tot = S.split.reduce((a, x) => a + x.amount, 0) + S.profit;
  chk(Math.abs(tot - S.revenue) < 1, m + ' split does not sum to revenue: ' + tot + ' vs ' + S.revenue);
  F.forEach(f => chk(f.qs.length === 0 || f.qs.length >= 3, m + ' ' + f.id + ' has only ' + f.qs.length + ' questions'));
  // make a loss case: scale volume to 60% and test ways reach breakeven
  ctx.__loss = R('scaleVol(__inp, __m, 0.6)');
  const SL = R('compute(__loss, __m)');
  if (SL.profit < 0) {
    const FL = R('detect(compute(__loss, __m), __loss, __m)');
    const loss = FL.find(f => f.id === 'loss');
    chk(!!loss, m + ' no loss finding');
    (loss && loss.ways || []).forEach(w => {
      if (!w.lever || w.value == null) return;
      ctx.__w = w;
      const p = R('compute(withK(__loss, __w.lever, __w.value), __m).profit');
      const ok = p >= -1;
      console.log('     way', w.lever, '=', +w.value.toFixed ? +(+w.value).toFixed(2) : w.value, '→ profit', Math.round(p), ok ? 'OK' : 'FAIL');
      chk(ok, m + ' way ' + w.lever + ' does not reach breakeven');
    });
  } else console.log('     (60% volume still profitable)');
}
console.log(fails ? fails + ' FAILURES' : 'ALL CHECKS PASSED');
