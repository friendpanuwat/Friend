/* ตัวเลขสุ่มและตัวเลขแปลก: ทุกรูปแบบ × ทุกเรื่อง ต้องไม่พัง และไม่มี NaN / Infinity ในตัวเลขที่ขึ้นจอ · รัน: node tests/fuzz.js */
const { load, genDec, sampleInp } = require('./cases');
const vm = require('vm');
const ctx = load();
const R = (c) => vm.runInContext(c, ctx);
let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
function wild(v) {
  const r = rnd();
  if (r < 0.12) return 0;
  if (r < 0.18) return null;
  if (r < 0.24) return v * 1000;
  if (r < 0.3) return v / 1000;
  return v * (0.2 + rnd() * 2);
}
const models = R('MODEL_ORDER'), topics = R('TOPIC_ORDER');
let bad = 0, runs = 0, okRuns = 0;
function scan(o, where) {
  const seen = new Set();
  (function walk(x, p) {
    if (x === null || x === undefined) return;
    if (typeof x === 'number') { if (!isFinite(x)) throw new Error('non-finite at ' + where + p); return; }
    if (typeof x !== 'object' || seen.has(x)) return;
    seen.add(x);
    for (const k of Object.keys(x)) { if (k === 'B' || k === 'st' || k === 'r') continue; walk(x[k], p + '.' + k); }
  })(o, '');
}
for (let i = 0; i < 700; i++) {
  const m = pick(models);
  const inp = sampleInp(ctx, m);
  for (const k of Object.keys(inp)) if (typeof inp[k] === 'number' && rnd() < 0.35) inp[k] = wild(inp[k]);
  if (rnd() < 0.2) inp.growth = pick([-5, -2, 3, 10]);
  if (rnd() < 0.15) inp.season = { high: [11, 12], low: [6, 7], highPct: 40, lowPct: 50 };
  if (rnd() < 0.15) inp.creditDays = pick([15, 45, 90]);
  const T = pick(topics);
  ctx.__t = T; ctx.__m = m;
  if (!R('topicOk(__t, __m)')) continue;
  const d = genDec(ctx, T, inp, m);
  for (const k of Object.keys(d)) if (typeof d[k] === 'number' && rnd() < 0.35) d[k] = wild(d[k]);
  if (T === 'equip' && rnd() < 0.2) d.fixedChg = -1e9;
  if (T === 'channel' && rnd() < 0.2) d.cut = pick([0, 99, 100, 150]);
  if (T === 'place' && rnd() < 0.2) d.salesPct = pick([-100, -95, 400]);
  ctx.__x = { inp, m, T, d };
  runs++;
  try {
    const E = R('dEval(__x.inp,__x.m,__x.T,__x.d)');
    if (!E.ok) continue;
    okRuns++;
    const C = R('dConds(dEval(__x.inp,__x.m,__x.T,__x.d),__x.inp,__x.m,__x.T,__x.d)');
    const S = R('dScenarios(__x.inp,__x.m,__x.T,__x.d)');
    scan({ profit: E.profit, delta: E.delta, low: E.low, need: E.need, payback: E.payback, rows: E.rows, ledger: E.ledger, conds: C, scen: S, extra: E.extraSteady }, m + '/' + T);
    const sum = E.ledger.reduce((a, l) => a + l.amount, 0);
    if (E.ledger.length && Math.abs(sum - E.delta) > 0.05) throw new Error('ledger ' + sum + ' vs ' + E.delta);
  } catch (e) { bad++; if (bad < 8) console.log('FAIL', m, T, e.message, JSON.stringify(d)); }
}
console.log(`${runs} runs · ${okRuns} computed · ${bad} problems`);
console.log(bad ? 'FUZZ FAILED' : 'FUZZ OK');
process.exit(bad ? 1 : 0);
