const fs = require('fs'), vm = require('vm');
const ctx = { console, Math, Date, JSON, Object, Array, String, Number, isFinite, parseFloat };
vm.createContext(ctx);
for (const f of ['../.out/calc.js', '../src/data.js', '../src/engine.js']) vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx);
const R = c => vm.runInContext(c, ctx);
const models = R('MODEL_ORDER');
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[Math.floor(rnd() * a.length)];
const val = () => pick([0, 0, null, 1, 0.5, 3, 10, 55, 100, 999, 12000, 250000, 5e6, -5]);
let bad = 0, n = 0, t0 = Date.now();
for (let it = 0; it < 600; it++) {
  const m = pick(models);
  const inp = JSON.parse(JSON.stringify(R(`MODELS['${m}'].sample`)));
  for (const k of Object.keys(inp)) if (typeof inp[k] === 'number' && rnd() < 0.35) inp[k] = val();
  if (rnd() < 0.2) inp.volumePer = pick(['day', 'month']);
  if (rnd() < 0.1) inp.cash = null;
  if (rnd() < 0.15) inp.growth = pick([-10, -2, 3, 20]);
  ctx.__i = inp; ctx.__m = m;
  try {
    const S = R('compute(__i, __m)'); n++;
    if (!S.ok) continue;
    const F = R('detect(compute(__i, __m), __i, __m)');
    const sens = R('sensitivity(compute(__i, __m), __i, __m)');
    const nums = [S.profit, S.revenue, S.cashEnd].concat(F.map(f => f.money)).concat(sens.map(s => s.gain));
    if (nums.some(x => x !== null && !isFinite(x))) { bad++; if (bad < 6) console.log('NONFINITE', m, JSON.stringify(inp), nums); }
    const texts = F.map(f => (f.unit === "none" ? "" : f.moneyText) + ' ' + f.ev.join(' ') + ' ' + (f.ways || []).map(w => w.text).join(' ')).join(' ');
    if (/NaN|undefined|Infinity|null/.test(texts)) { bad++; if (bad < 6) console.log('BADTEXT', m, texts.match(/.{0,40}(NaN|undefined|Infinity|null).{0,20}/)[0], JSON.stringify(inp)); }
    // levers/insights
    for (const k of R(`MODEL_LEVERS['${m}'].concat(COMMON_LEVERS)`)) {
      ctx.__k = k;
      const t = R('(function(){ var ti = Object.assign({}, __i); ti[__k] = n0(__i[__k]) * 1.3 + 1; return leverInsight(__k, __i, ti, __m, compute(__i,__m), compute(ti,__m)) + " " + leverRange(__k, __i, __m).join(",") + " " + leverStep(__k, __i, __m); })()');
      if (/NaN|undefined|Infinity/.test(t)) { bad++; if (bad < 10) console.log('LEVER', m, k, t.slice(0, 120)); }
    }
    F.forEach(f => (f.qs || []).forEach(q => { ctx.__q = q; const tag = R('pointTag(QBANK[__q].lever, compute(__i,__m), __i, __m)'); if (/NaN|undefined|Infinity/.test(tag)) { bad++; if (bad < 12) console.log('TAG', m, q, tag); } }));
  } catch (e) { bad++; if (bad < 12) console.log('THROW', m, e.message, JSON.stringify(inp)); }
}
console.log('runs', n, 'problems', bad, 'ms', Date.now() - t0);
